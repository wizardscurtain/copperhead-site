// API route for sending emails via Resend
// Production-ready email handling with error recovery

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { siteConfig } from '@/lib/config'
import { validateContactForm, validateQuoteRequest } from '@/lib/email'
import type { ContactForm, QuoteRequest } from '@/lib/types'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting (simple in-memory store for production use Redis)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_MAX = 5 // Max 5 emails per hour per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

function getRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)
  
  if (!userLimit || now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 }
  }
  
  userLimit.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX - userLimit.count }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Check rate limit
    const rateLimit = getRateLimit(clientIP)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429, 
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (Date.now() + RATE_LIMIT_WINDOW).toString()
          }
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const { formData, type = 'contact' } = body

    // Validate form data
    const validation = type === 'quote' 
      ? validateQuoteRequest(formData as QuoteRequest)
      : validateContactForm(formData as ContactForm)

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    // Verify Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Decode recipient email
    const recipientEmail = Buffer.from(siteConfig.contact.emailObfuscated, 'base64').toString()

    // Prepare email data
    const emailData = {
      from: 'CopperheadCI Website <noreply@copperheadci.com>',
      to: [recipientEmail],
      replyTo: formData.email,
      subject: body.subject,
      html: body.html,
      text: body.text,
      // Add priority for urgent requests
      ...(type === 'quote' && (formData as QuoteRequest).urgency === 'emergency' && {
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'High'
        }
      })
    }

    // Send email
    const emailResult = await resend.emails.send(emailData)

    if (emailResult.error) {
      console.error('Resend API error:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    // Log successful submission (for analytics/monitoring)
    console.log(`Email sent successfully:`, {
      id: emailResult.data?.id,
      type,
      from: formData.email,
      urgency: type === 'quote' ? (formData as QuoteRequest).urgency : 'normal',
      timestamp: new Date().toISOString()
    })

    // Return success response with rate limit headers
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        id: emailResult.data?.id 
      },
      {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': (Date.now() + RATE_LIMIT_WINDOW).toString()
        }
      }
    )

  } catch (error) {
    console.error('Email API error:', error)
    
    // Return user-friendly error message
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again later or contact us directly.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
