"use client"

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import DOMPurify from 'dompurify'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { toast } from 'sonner'
import { sanitizeAnalyticsData, formSubmissionLimiter, SecureStorage, csrfManager } from '../lib/security'

// Security-enhanced form validation schemas with strict limits
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Please provide a valid email address')
    .max(254, 'Email address too long'),
  phone: z.string()
    .max(20, 'Phone number too long')
    .regex(/^[\d\s\-\(\)\+\.]*$/, 'Phone contains invalid characters')
    .optional(),
  company: z.string()
    .max(200, 'Company name too long')
    .regex(/^[a-zA-Z0-9\s\-&\.,'"]+$/, 'Company name contains invalid characters')
    .optional(),
  services: z.array(z.string().max(50)).max(10, 'Too many services selected').optional(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters long')
    .max(5000, 'Message must be less than 5000 characters'),
  budget: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to our privacy policy to continue'
  })
})

const quoteSchema = contactSchema.extend({
  serviceType: z.string()
    .min(2, 'Please specify the service type you need')
    .max(100, 'Service type too long'),
  duration: z.string()
    .max(200, 'Duration description too long')
    .regex(/^[a-zA-Z0-9\s\-,\.]+$/, 'Duration contains invalid characters')
    .optional(),
  location: z.string()
    .max(200, 'Location too long')
    .regex(/^[a-zA-Z0-9\s\-,\.]+$/, 'Location contains invalid characters')
    .optional(),
  urgency: z.enum(['low', 'medium', 'high', 'emergency'], {
    required_error: 'Please select an urgency level'
  }),
  additionalDetails: z.string()
    .max(2000, 'Additional details too long')
    .optional()
})

// Security utility functions
const sanitizeInput = (input: string): string => {
  if (typeof window !== 'undefined' && DOMPurify) {
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true 
    });
  }
  // Fallback sanitization for server-side or when DOMPurify unavailable
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/script/gi, '')
    .trim();
}

const sanitizeEmailContent = (content: string): string => {
  // Additional email-specific sanitization
  return sanitizeInput(content)
    .replace(/[\r\n]{3,}/g, '\n\n') // Limit consecutive newlines
    .substring(0, 10000); // Hard limit for email content
}

type ContactFormData = z.infer<typeof contactSchema>
type QuoteFormData = z.infer<typeof quoteSchema>

interface ContactFormProps {
  type?: 'contact' | 'quote'
  title?: string
  description?: string
  className?: string
}

const serviceOptions = [
  'Executive Protection',
  'Security Consulting',
  'Private Investigation', 
  'Risk Assessment',
  'K9 Detection Services',
  'Training Services',
  'Cybersecurity',
  'Surveillance',
  'Emergency Response'
]

const budgetRanges = [
  'Under $5,000',
  '$5,000 - $15,000', 
  '$15,000 - $50,000',
  '$50,000 - $100,000',
  'Over $100,000',
  'Discuss during consultation'
]

const timelines = [
  'Immediate (Emergency)',
  'Within 24 hours',
  'Within 1 week',
  'Within 1 month',
  '1-3 months',
  'Flexible/Ongoing'
]

export function ContactForm({ 
  type = 'contact', 
  title = 'Contact Us',
  description = 'Get in touch with our security experts to discuss your needs.',
  className = ''
}: ContactFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const isQuoteForm = type === 'quote'
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ContactFormData | QuoteFormData>({
    resolver: zodResolver(isQuoteForm ? quoteSchema : contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      services: [],
      message: '',
      budget: '',
      timeline: '',
      source: 'website',
      consent: false,
      ...(isQuoteForm && {
        serviceType: '',
        urgency: 'medium' as const,
        duration: '',
        location: '',
        additionalDetails: ''
      })
    }
  })

  const selectedServices = watch('services') || []
  const urgencyLevel = isQuoteForm ? (watch as any)('urgency') : 'medium'

  const onSubmit = (data: ContactFormData | QuoteFormData) => {
    try {\n      // Rate limiting check\n      if (!formSubmissionLimiter.isAllowed('form_submit')) {\n        setError('Too many submissions. Please wait before submitting again.');\n        return;\n      }\n\n      // Track form submission with sanitized data\n      if (typeof window !== 'undefined' && 'gtag' in window) {\n        const sanitizedEventData = sanitizeAnalyticsData({\n          event_category: 'engagement',\n          event_label: `${type}_form_submission`,\n          value: isQuoteForm ? 1 : 0.5\n        });\n        (window as any).gtag('event', 'form_submit', sanitizedEventData);\n      }

      startTransition(() => {
        setIsSubmitting(true)
      })

      // Remove consent from data (internal use only)
      const { consent, ...formData } = data
      
      // Generate mailto link with pre-filled content
      const subject = isQuoteForm 
        ? `Quote Request: ${(formData as any).services?.join(', ') || 'Security Services'} - ${(formData as any).urgency?.toUpperCase() || 'STANDARD'}`
        : `Contact Form: ${(formData as any).services?.join(', ') || 'General Inquiry'}`
      
      const emailBody = isQuoteForm ? 
        generateQuoteEmailBody(formData as QuoteFormData) :
        generateContactEmailBody(formData as ContactFormData)
      
      const mailtoUrl = `mailto:contact@copperheadci.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
      
      // Open default email client
      window.location.href = mailtoUrl
      
      setIsSubmitted(true)
      reset()
      
      // Track successful submission with sanitized data\n      if (typeof window !== 'undefined' && 'gtag' in window) {\n        const sanitizedEventData = sanitizeAnalyticsData({\n          event_category: 'engagement',\n          event_label: `${type}_form_success`\n        });\n        (window as any).gtag('event', 'form_success', sanitizedEventData);\n      }\n\n      // Store submission timestamp securely\n      SecureStorage.setItem('last_submission', Date.now().toString());
    } catch (err) {
      console.error('Form submission error:', err)
      setError('An unexpected error occurred. Please try again or contact us directly.')
      
      // Track form error with sanitized data\n      if (typeof window !== 'undefined' && 'gtag' in window) {\n        const sanitizedEventData = sanitizeAnalyticsData({\n          event_category: 'engagement',\n          event_label: `${type}_form_error`\n        });\n        (window as any).gtag('event', 'form_error', sanitizedEventData);\n      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate sanitized email body for contact form
  const generateContactEmailBody = (data: ContactFormData): string => {
    const sanitizedData = {
      name: sanitizeEmailContent(data.name),
      email: sanitizeEmailContent(data.email),
      phone: data.phone ? sanitizeEmailContent(data.phone) : 'Not provided',
      company: data.company ? sanitizeEmailContent(data.company) : 'Not provided',
      services: data.services?.map(s => sanitizeEmailContent(s)).join(', ') || 'Not specified',
      message: sanitizeEmailContent(data.message)
    };

    return `New Contact Form Submission - Copperhead Consulting Inc

Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Phone: ${sanitizedData.phone}
Company: ${sanitizedData.company}
Services: ${sanitizedData.services}

Message:
${sanitizedData.message}

---
Submitted from: copperheadci.com contact form
Submission time: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST
Security: Form data sanitized and validated`
  }

  // Generate sanitized email body for quote request
  const generateQuoteEmailBody = (data: QuoteFormData): string => {
    const sanitizedData = {
      name: sanitizeEmailContent(data.name),
      email: sanitizeEmailContent(data.email),
      phone: data.phone ? sanitizeEmailContent(data.phone) : 'Not provided',
      company: data.company ? sanitizeEmailContent(data.company) : 'Not provided',
      services: (data as any).services?.map((s: string) => sanitizeEmailContent(s)).join(', ') || 'Not specified',
      timeline: (data as any).timeline ? sanitizeEmailContent((data as any).timeline) : 'Not specified',
      budget: (data as any).budget ? sanitizeEmailContent((data as any).budget) : 'Not specified',
      urgency: sanitizeEmailContent((data as any).urgency || 'Standard'),
      message: sanitizeEmailContent(data.message),
      serviceType: sanitizeEmailContent((data as any).serviceType || ''),
      location: (data as any).location ? sanitizeEmailContent((data as any).location) : 'Not specified',
      duration: (data as any).duration ? sanitizeEmailContent((data as any).duration) : 'Not specified',
      additionalDetails: (data as any).additionalDetails ? sanitizeEmailContent((data as any).additionalDetails) : ''
    };

    return `New Quote Request - Copperhead Consulting Inc

Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Phone: ${sanitizedData.phone}
Company: ${sanitizedData.company}
Primary Service: ${sanitizedData.serviceType}
Services: ${sanitizedData.services}
Timeline: ${sanitizedData.timeline}
Budget: ${sanitizedData.budget}
Location: ${sanitizedData.location}
Duration: ${sanitizedData.duration}
Urgency: ${sanitizedData.urgency}

Message/Requirements:
${sanitizedData.message}

Additional Details:
${sanitizedData.additionalDetails}

---
Submitted from: copperheadci.com quote request
Submission time: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST
Security: Form data sanitized and validated`
  }

  if (isSubmitted) {
    return (
      <div className={`max-w-2xl mx-auto p-8 text-center ${className}`}>
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Email Client Opened!
          </h3>
          <p className="text-muted-foreground mb-6">
            Your default email client should now be open with your {isQuoteForm ? 'quote request' : 'message'} pre-filled. 
            Please review and send the email to contact@copperheadci.com.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>If your email client didn't open:</strong><br/>
              You can manually email us at{' '}
              <a 
                href="mailto:contact@copperheadci.com" 
                className="text-accent hover:underline font-semibold"
              >
                contact@copperheadci.com
              </a>
            </p>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={() => {
                setIsSubmitted(false)
                reset()
              }}
              variant="outline"
              className="mr-4"
            >
              Submit Another {isQuoteForm ? 'Quote Request' : 'Message'}
            </Button>
            <Button
              onClick={() => window.open('tel:+13605199932', '_self')}
              className="bg-accent hover:bg-accent/90"
            >
              Call for Immediate Assistance: (360) 519-9932
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
        
        {isQuoteForm && (
          <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <h4 className="font-semibold text-accent mb-2">📞 Need Immediate Assistance?</h4>
            <p className="text-sm text-muted-foreground">
              For emergency security situations, call us directly at{' '}
              <a 
                href="tel:+13605199932" 
                className="font-semibold text-accent hover:underline"
              >
                (360) 519-9932
              </a>
              {' '}for 24/7 emergency response.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="John Smith"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
              placeholder="john@company.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="(555) 123-4567"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Company/Organization</Label>
            <Input
              id="company"
              {...register('company')}
              placeholder="Company Name"
            />
          </div>
        </div>

        {/* Quote-specific fields */}
        {isQuoteForm && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceType">
                  Primary Service Needed <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('serviceType' as any, value)}>
                  <SelectTrigger className={(errors as any).serviceType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(errors as any).serviceType && (
                  <p className="text-red-500 text-sm mt-1">{(errors as any).serviceType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="urgency">
                  Priority Level <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('urgency' as any, value)} defaultValue="medium">
                  <SelectTrigger className={(errors as any).urgency ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Planning ahead</SelectItem>
                    <SelectItem value="medium">Medium - Within 1-2 weeks</SelectItem>
                    <SelectItem value="high">High - Within 48 hours</SelectItem>
                    <SelectItem value="emergency">🚨 Emergency - Immediate</SelectItem>
                  </SelectContent>
                </Select>
                {(errors as any).urgency && (
                  <p className="text-red-500 text-sm mt-1">{(errors as any).urgency.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Service Location</Label>
                <Input
                  id="location"
                  {...register('location' as any)}
                  placeholder="Seattle, WA"
                />
              </div>

              <div>
                <Label htmlFor="duration">Expected Duration</Label>
                <Input
                  id="duration"
                  {...register('duration' as any)}
                  placeholder="e.g., 2 weeks, ongoing"
                />
              </div>
            </div>
          </>
        )}

        {/* Services of Interest */}
        <div>
          <Label className="text-base font-medium">Services of Interest</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {serviceOptions.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={selectedServices.includes(service)}
                  onCheckedChange={(checked) => {
                    const newServices = checked
                      ? [...selectedServices, service]
                      : selectedServices.filter(s => s !== service)
                    setValue('services', newServices)
                  }}
                />
                <Label
                  htmlFor={service}
                  className="text-sm font-normal cursor-pointer"
                >
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Budget and Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="budget">Budget Range</Label>
            <Select onValueChange={(value) => setValue('budget', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                {budgetRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timeline">Timeline</Label>
            <Select onValueChange={(value) => setValue('timeline', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                {timelines.map((timeline) => (
                  <SelectItem key={timeline} value={timeline}>
                    {timeline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message">
            {isQuoteForm ? 'Project Details' : 'Message'} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="message"
            {...register('message')}
            className={`min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
            placeholder={
              isQuoteForm 
                ? "Please describe your security needs, specific requirements, and any additional details that would help us provide an accurate quote..."
                : "Please describe your security needs or questions..."
            }
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        {/* Additional Details for Quotes */}
        {isQuoteForm && (
          <div>
            <Label htmlFor="additionalDetails">Additional Requirements</Label>
            <Textarea
              id="additionalDetails"
              {...register('additionalDetails' as any)}
              className="min-h-[80px]"
              placeholder="Any special requirements, constraints, or additional information..."
            />
          </div>
        )}

        {/* Privacy Consent */}
        <div className="flex items-start space-x-2" style={{ pointerEvents: 'auto', zIndex: 10 }}>
          <Checkbox
            id="consent"
            {...register('consent')}
            className={errors.consent ? 'border-red-500' : ''}
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
          />
          <div className="grid gap-1.5 leading-none" style={{ pointerEvents: 'auto', zIndex: 10 }}>
            <Label
              htmlFor="consent"
              className="text-sm font-normal cursor-pointer"
              style={{ pointerEvents: 'auto', zIndex: 10 }}
            >
              I agree to Copperhead Consulting's{' '}
              <a 
                href="/privacy" 
                className="text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{' '}
              and consent to being contacted about this inquiry. <span className="text-red-500">*</span>
            </Label>
            {errors.consent && (
              <p className="text-red-500 text-xs">{errors.consent.message}</p>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Opening Email Client...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {isQuoteForm ? 'Open Email for Quote Request' : 'Open Email to Send Message'}
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {isQuoteForm ? (
            urgencyLevel === 'emergency' 
              ? '🚨 Emergency requests receive immediate attention within 1 hour'
              : urgencyLevel === 'high'
              ? '⚡ High priority requests receive response within 4 hours'
              : 'Standard quote requests receive response within 24 hours'
          ) : (
            'We typically respond to all inquiries within 24 hours'
          )}
        </p>
      </form>
    </div>
  )
}
