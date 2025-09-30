// Email service integration for contact forms
// Production-ready email handling with obfuscation

import { siteConfig } from './config'
import type { ContactForm, QuoteRequest } from './types'

// Decode obfuscated email address client-side
export function getContactEmail(): string {
  try {
    return atob(siteConfig.contact.emailObfuscated)
  } catch (error) {
    console.error('Failed to decode contact email:', error)
    return 'contact@copperheadci.com' // Fallback
  }
}

// Email templates for different form types
const emailTemplates = {
  contact: (data: ContactForm) => ({
    subject: `New Contact Inquiry from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); padding: 30px; text-align: center;">
          <h1 style="color: #ff6b35; margin: 0; font-size: 24px;">Copperhead Consulting Inc</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0;">New Contact Inquiry</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #333333; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">Contact Details</h2>
          
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Name:</td>
              <td style="padding: 10px; color: #333;">${data.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Email:</td>
              <td style="padding: 10px; color: #333;">${data.email}</td>
            </tr>
            ${data.phone ? `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Phone:</td>
              <td style="padding: 10px; color: #333;">${data.phone}</td>
            </tr>
            ` : ''}
            ${data.company ? `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Company:</td>
              <td style="padding: 10px; color: #333;">${data.company}</td>
            </tr>
            ` : ''}
          </table>
          
          ${data.services && data.services.length > 0 ? `
          <h3 style="color: #333333; margin-top: 25px;">Services of Interest:</h3>
          <ul style="color: #666; line-height: 1.6;">
            ${data.services.map(service => `<li>${service}</li>`).join('')}
          </ul>
          ` : ''}
          
          <h3 style="color: #333333; margin-top: 25px;">Message:</h3>
          <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #ff6b35; color: #333; line-height: 1.6;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h4 style="color: #ff6b35; margin: 0 0 10px 0;">Quick Actions:</h4>
            <a href="mailto:${data.email}?subject=Re: Your Security Consulting Inquiry" 
               style="display: inline-block; background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 10px;">Reply via Email</a>
            ${data.phone ? `
            <a href="tel:${data.phone.replace(/[^0-9]/g, '')}" 
               style="display: inline-block; background: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Call Now</a>
            ` : ''}
          </div>
        </div>
        
        <div style="background: #333; color: #999; text-align: center; padding: 20px; font-size: 12px;">
          <p>This email was sent from the CopperheadCI.com contact form</p>
          <p>Submitted on ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST</p>
        </div>
      </div>
    `,
    text: `
New Contact Inquiry - Copperhead Consulting Inc

From: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}\n` : ''}${data.company ? `Company: ${data.company}\n` : ''}

${data.services && data.services.length > 0 ? `Services of Interest:\n${data.services.map(s => `- ${s}`).join('\n')}\n\n` : ''}Message:\n${data.message}

---
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST
    `
  }),

  quote: (data: QuoteRequest) => ({
    subject: `Urgent Quote Request: ${data.serviceType} - ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b35, #d4541c); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🚨 PRIORITY QUOTE REQUEST</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">${data.serviceType} - Urgency: ${data.urgency.toUpperCase()}</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <div style="background: ${data.urgency === 'emergency' ? '#ff4444' : data.urgency === 'high' ? '#ff8800' : '#28a745'}; color: white; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
            <strong>Priority Level: ${data.urgency.toUpperCase()}</strong>
            ${data.urgency === 'emergency' ? ' - IMMEDIATE RESPONSE REQUIRED' : ''}
          </div>
          
          <h2 style="color: #333333; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">Quote Request Details</h2>
          
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Service Type:</td>
              <td style="padding: 10px; color: #333; font-weight: bold;">${data.serviceType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Client Name:</td>
              <td style="padding: 10px; color: #333;">${data.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Email:</td>
              <td style="padding: 10px; color: #333;">${data.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Phone:</td>
              <td style="padding: 10px; color: #333;">${data.phone || 'Not provided'}</td>
            </tr>
            ${data.company ? `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Company:</td>
              <td style="padding: 10px; color: #333;">${data.company}</td>
            </tr>
            ` : ''}
            ${data.duration ? `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Duration:</td>
              <td style="padding: 10px; color: #333;">${data.duration}</td>
            </tr>
            ` : ''}
            ${data.location ? `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Location:</td>
              <td style="padding: 10px; color: #333;">${data.location}</td>
            </tr>
            ` : ''}
            ${data.budget ? `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Budget Range:</td>
              <td style="padding: 10px; color: #333;">${data.budget}</td>
            </tr>
            ` : ''}
            ${data.timeline ? `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #666;">Timeline:</td>
              <td style="padding: 10px; color: #333;">${data.timeline}</td>
            </tr>
            ` : ''}
          </table>
          
          <h3 style="color: #333333; margin-top: 25px;">Project Details:</h3>
          <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #ff6b35; color: #333; line-height: 1.6;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          
          ${data.additionalDetails ? `
          <h3 style="color: #333333; margin-top: 25px;">Additional Requirements:</h3>
          <div style="background: #fff3cd; padding: 20px; border-left: 4px solid #ffc107; color: #333; line-height: 1.6;">
            ${data.additionalDetails.replace(/\n/g, '<br>')}
          </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding: 20px; background: ${data.urgency === 'emergency' ? '#ffebee' : '#f8f9fa'}; border-radius: 8px; border-left: 4px solid ${data.urgency === 'emergency' ? '#f44336' : '#ff6b35'};">
            <h4 style="color: #ff6b35; margin: 0 0 15px 0;">Immediate Actions Required:</h4>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <a href="mailto:${data.email}?subject=Quote for ${data.serviceType} - CopperheadCI Response" 
                 style="display: inline-block; background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px;">Send Quote</a>
              ${data.phone ? `
              <a href="tel:${data.phone.replace(/[^0-9]/g, '')}" 
                 style="display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px;">Call Client</a>
              ` : ''}
              <a href="mailto:team@copperheadci.com?subject=Quote Assignment: ${data.serviceType}&body=New quote request from ${data.name} requires team assignment." 
                 style="display: inline-block; background: #6c757d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px;">Assign Team</a>
            </div>
            
            ${data.urgency === 'emergency' ? `
            <div style="margin-top: 15px; padding: 15px; background: #f44336; color: white; border-radius: 6px; text-align: center;">
              <strong>⚠️ EMERGENCY REQUEST - RESPOND WITHIN 1 HOUR</strong>
            </div>
            ` : data.urgency === 'high' ? `
            <div style="margin-top: 15px; padding: 15px; background: #ff9800; color: white; border-radius: 6px; text-align: center;">
              <strong>🔥 HIGH PRIORITY - RESPOND WITHIN 4 HOURS</strong>
            </div>
            ` : ''}
          </div>
        </div>
        
        <div style="background: #333; color: #999; text-align: center; padding: 20px; font-size: 12px;">
          <p>Quote request submitted via CopperheadCI.com</p>
          <p>Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST</p>
          <p>Response Time Target: ${data.urgency === 'emergency' ? '1 hour' : data.urgency === 'high' ? '4 hours' : '24 hours'}</p>
        </div>
      </div>
    `,
    text: `
🚨 PRIORITY QUOTE REQUEST - ${data.serviceType}
Urgency: ${data.urgency.toUpperCase()}

Quote Request Details:
- Service Type: ${data.serviceType}
- Client: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
${data.company ? `- Company: ${data.company}\n` : ''}${data.duration ? `- Duration: ${data.duration}\n` : ''}${data.location ? `- Location: ${data.location}\n` : ''}${data.budget ? `- Budget: ${data.budget}\n` : ''}${data.timeline ? `- Timeline: ${data.timeline}\n` : ''}

Project Details:
${data.message}

${data.additionalDetails ? `Additional Requirements:\n${data.additionalDetails}\n\n` : ''}Priority Level: ${data.urgency.toUpperCase()}${data.urgency === 'emergency' ? ' - IMMEDIATE RESPONSE REQUIRED' : ''}

Response Time Target: ${data.urgency === 'emergency' ? '1 hour' : data.urgency === 'high' ? '4 hours' : '24 hours'}

---
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST
    `
  })
}

// Send email function (will be used with API route)
export async function sendContactEmail(formData: ContactForm | QuoteRequest, type: 'contact' | 'quote' = 'contact') {
  try {
    const template = type === 'quote' 
      ? emailTemplates.quote(formData as QuoteRequest)
      : emailTemplates.contact(formData as ContactForm)
    
    // Get backend URL from environment variables with fallbacks
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 
                      import.meta.env.REACT_APP_BACKEND_URL || 
                      (typeof window !== 'undefined' && window.location.origin) ||
                      'http://localhost:8001'
    
    const response = await fetch(`${backendUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: getContactEmail(),
        subject: template.subject,
        html: template.html,
        ...(('text' in template) && { text: template.text }),
        formData,
        type
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

// Form validation helpers
export function validateContactForm(data: Partial<ContactForm>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please provide a valid email address')
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }

  if (data.phone && !/^[\d\s\-\(\)\+\.]{10,}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.push('Please provide a valid phone number')
  }

  return { isValid: errors.length === 0, errors }
}

export function validateQuoteRequest(data: Partial<QuoteRequest>): { isValid: boolean; errors: string[] } {
  const { errors: baseErrors } = validateContactForm(data)
  const errors = [...baseErrors]

  if (!data.serviceType || data.serviceType.trim().length < 2) {
    errors.push('Please specify the service type you need')
  }

  if (!data.urgency || !['low', 'medium', 'high', 'emergency'].includes(data.urgency)) {
    errors.push('Please select a valid urgency level')
  }

  return { isValid: errors.length === 0, errors }
}
