# CopperheadCI Technical Implementation Roadmap

## Phase 1: Foundation & Architecture Implementation

### 1.1 Project Structure Reorganization

#### New Directory Structure
```
/app
├── app/
│   ├── (marketing)/          # Marketing pages group
│   │   ├── page.tsx          # Home page
│   │   ├── about/
│   │   ├── services/
│   │   └── contact/
│   ├── api/                  # API routes
│   ├── globals.css
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                   # Shadcn components
│   ├── marketing/            # Marketing-specific components
│   ├── forms/                # Form components
│   ├── seo/                  # SEO components
│   └── layout/               # Layout components
├── lib/
│   ├── config/               # Configuration files
│   ├── utils/                # Utility functions
│   ├── seo/                  # SEO utilities
│   ├── analytics/            # Analytics setup
│   └── email/                # Email service integration
├── types/                    # TypeScript type definitions
├── content/                  # Content management
└── public/
    ├── assets/
    ├── images/
    └── seo/                  # SEO-specific assets
```

#### Core Configuration Files

**lib/config/site.ts**
```typescript
export const siteConfig = {
  name: "Copperhead Consulting Inc",
  description: "Elite security consulting, executive protection, and risk assessment services in Seattle, WA",
  url: "https://copperheadci.com",
  ogImage: "https://copperheadci.com/og-image.jpg",
  links: {
    linkedin: "https://www.linkedin.com/company/copperhead-consulting",
    twitter: "https://twitter.com/copperheadci",
  },
  contact: {
    phone: "(360) 519-9932",
    email: "info@copperheadci.com", // Public email
    address: {
      street: "10002 Aurora Ave N Ste 36, PMB 432",
      city: "Seattle",
      state: "WA",
      zip: "98133",
      country: "US"
    }
  },
  business: {
    founded: "2004",
    employees: "50+",
    certifications: ["ISO 27001 Certified", "Licensed & Bonded"],
    serviceArea: {
      primary: "Seattle Metro Area",
      secondary: "Pacific Northwest",
      radius: "100 miles"
    }
  }
}

export const seoConfig = {
  defaultTitle: "Copperhead Consulting Inc - Elite Security Solutions Seattle",
  titleTemplate: "%s | Copperhead Consulting Inc",
  defaultDescription: "Professional security consulting, executive protection, private investigations, and risk assessment services in Seattle, WA. 20+ years experience, 50+ trained agents.",
  keywords: [
    "security consulting Seattle",
    "executive protection Washington",
    "private investigation services",
    "risk assessment consulting",
    "corporate security solutions",
    "K9 detection services",
    "surveillance services",
    "threat assessment",
    "security operations center",
    "TSCM services"
  ],
  localKeywords: [
    "Seattle security consulting",
    "Washington executive protection",
    "Pacific Northwest security services",
    "Bellevue private investigation",
    "Tacoma security consulting",
    "Everett executive protection"
  ]
}
```

### 1.2 Performance Infrastructure

#### Enhanced Next.js Configuration

**next.config.mjs**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Enable linting
  },
  typescript: {
    ignoreBuildErrors: false, // Enable type checking
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['@/components/ui', 'lucide-react'],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
  },
  compress: true,
  poweredByHeader: false,
  
  // Enhanced security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com *.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' *.vercel-insights.com *.google-analytics.com;",
          },
        ],
      },
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
```

#### Performance Monitoring Component

**components/seo/performance-monitor.tsx**
```typescript
'use client'

import { useEffect } from 'react'
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals'

interface Metric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

export function PerformanceMonitor() {
  useEffect(() => {
    const sendToAnalytics = (metric: Metric) => {
      // Send to Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.rating,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        })
      }
      
      // Send to Vercel Analytics
      if (typeof window !== 'undefined' && window.va) {
        window.va('track', 'Web Vital', {
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
        })
      }
    }

    getCLS(sendToAnalytics)
    getFCP(sendToAnalytics)
    getFID(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
  }, [])

  return null
}
```

### 1.3 SEO Foundation

#### Dynamic Metadata Generation

**lib/seo/metadata.ts**
```typescript
import { Metadata } from 'next'
import { siteConfig, seoConfig } from '@/lib/config/site'

interface GenerateMetadataProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  noIndex?: boolean
  canonical?: string
  type?: 'website' | 'article' | 'service'
  publishedTime?: string
  modifiedTime?: string
}

export function generateMetadata({
  title,
  description = seoConfig.defaultDescription,
  keywords = [],
  image = siteConfig.ogImage,
  noIndex = false,
  canonical,
  type = 'website',
  publishedTime,
  modifiedTime,
}: GenerateMetadataProps = {}): Metadata {
  const metaTitle = title 
    ? `${title} | ${siteConfig.name}`
    : seoConfig.defaultTitle

  const allKeywords = [...seoConfig.keywords, ...seoConfig.localKeywords, ...keywords]

  return {
    title: metaTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonical || '/',
    },
    openGraph: {
      title: metaTitle,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: 'en_US',
      type,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: [image],
      creator: '@copperheadci',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE,
    },
    other: {
      'theme-color': '#ff6b35',
      'msapplication-TileColor': '#ff6b35',
      // AEO (Answer Engine Optimization) tags
      'ai:company': siteConfig.name,
      'ai:industry': 'Security Consulting',
      'ai:services': 'Executive Protection, Private Investigations, K9 Detection, Risk Assessment, Security Operations, Surveillance, Robotics',
      'ai:location': `${siteConfig.contact.address.city}, ${siteConfig.contact.address.state}, ${siteConfig.contact.address.country}`,
      'ai:phone': siteConfig.contact.phone,
      'ai:experience': '20+ years',
      'ai:agents': siteConfig.business.employees,
      'ai:certifications': siteConfig.business.certifications.join(', '),
      'ai:availability': '24/7 Response',
      'ai:service-area': siteConfig.business.serviceArea.primary,
    },
  }
}
```

#### Enhanced Structured Data

**lib/seo/structured-data.ts**
```typescript
import { siteConfig } from '@/lib/config/site'

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SecurityService',
  '@id': `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  alternateName: 'Copperhead CI',
  url: siteConfig.url,
  logo: {
    '@type': 'ImageObject',
    url: `${siteConfig.url}/logo.png`,
    width: 300,
    height: 100,
  },
  image: {
    '@type': 'ImageObject',
    url: siteConfig.ogImage,
    width: 1200,
    height: 630,
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'customer service',
      availableLanguage: 'English',
      areaServed: 'US',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday', 
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: '00:00',
        closes: '23:59'
      }
    },
    {
      '@type': 'ContactPoint',
      email: siteConfig.contact.email,
      contactType: 'customer service',
      availableLanguage: 'English',
    }
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.contact.address.street,
    addressLocality: siteConfig.contact.address.city,
    addressRegion: siteConfig.contact.address.state,
    postalCode: siteConfig.contact.address.zip,
    addressCountry: siteConfig.contact.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 47.6062,
    longitude: -122.3321,
  },
  sameAs: [
    siteConfig.links.linkedin,
    siteConfig.links.twitter,
  ],
  foundingDate: siteConfig.business.founded,
  numberOfEmployees: siteConfig.business.employees,
  slogan: 'We value your safety',
  description: 'Elite security consulting firm delivering exceptional security, intelligence, and risk assessment solutions using cutting-edge technology and skilled senior professionals.',
  serviceArea: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 47.6062,
      longitude: -122.3321,
    },
    geoRadius: '160934', // 100 miles in meters
  },
  hasCredential: siteConfig.business.certifications.map(cert => ({
    '@type': 'EducationalOccupationalCredential',
    name: cert,
  })),
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '50',
    bestRating: '5',
    worstRating: '1',
  },
}

export const servicesSchema = [
  {
    '@type': 'Service',
    '@id': `${siteConfig.url}/services/executive-protection`,
    name: 'Executive Protection',
    provider: {
      '@id': `${siteConfig.url}/#organization`,
    },
    description: 'Elite, discreet protection for executives and high-profile clients',
    serviceType: 'Security Service',
    areaServed: {
      '@type': 'State',
      name: 'Washington',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Executive Protection Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Personal Protection',
            description: 'Close protection for high-risk individuals',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Advance Security',
            description: 'Location security assessment and preparation',
          },
        },
      ],
    },
  },
  {
    '@type': 'Service',
    '@id': `${siteConfig.url}/services/private-investigations`,
    name: 'Private Investigations',
    provider: {
      '@id': `${siteConfig.url}/#organization`,
    },
    description: 'Confidential, thorough investigations tailored to your needs',
    serviceType: 'Investigation Service',
    areaServed: {
      '@type': 'State',
      name: 'Washington',
    },
  },
  {
    '@type': 'Service',
    '@id': `${siteConfig.url}/services/k9-detection`,
    name: 'K9 Detection Services',
    provider: {
      '@id': `${siteConfig.url}/#organization`,
    },
    description: 'Internationally certified teams specializing in firearms, explosives and narcotics detection',
    serviceType: 'Security Service',
    areaServed: {
      '@type': 'State',
      name: 'Washington',
    },
  },
  {
    '@type': 'Service',
    '@id': `${siteConfig.url}/services/risk-assessment`,
    name: 'Threat/Risk Assessments',
    provider: {
      '@id': `${siteConfig.url}/#organization`,
    },
    description: 'Proactive threat and risk assessments to safeguard your assets and operations',
    serviceType: 'Risk Assessment',
    areaServed: {
      '@type': 'State',
      name: 'Washington',
    },
  },
]

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  description: 'Elite security solutions and risk assessment services',
  publisher: {
    '@id': `${siteConfig.url}/#organization`,
  },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
})
```

## Phase 2: SEO & Content Optimization Implementation

### 2.1 Local SEO Components

**components/seo/local-business-schema.tsx**
```typescript
import { organizationSchema } from '@/lib/seo/structured-data'

export function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema),
      }}
    />
  )
}
```

**components/marketing/service-area-map.tsx**
```typescript
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Clock } from 'lucide-react'
import { siteConfig } from '@/lib/config/site'

const serviceAreas = [
  { name: 'Seattle', type: 'primary', distance: '0 miles' },
  { name: 'Bellevue', type: 'primary', distance: '8 miles' },
  { name: 'Tacoma', type: 'secondary', distance: '32 miles' },
  { name: 'Everett', type: 'secondary', distance: '28 miles' },
  { name: 'Spokane', type: 'extended', distance: '280 miles' },
  { name: 'Portland, OR', type: 'extended', distance: '173 miles' },
]

export function ServiceAreaMap() {
  const [selectedArea, setSelectedArea] = useState('Seattle')

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-500" />
          Service Areas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Coverage Areas</h3>
            <div className="space-y-2">
              {serviceAreas.map((area) => (
                <div
                  key={area.name}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedArea === area.name
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedArea(area.name)}
                >
                  <div>
                    <span className="font-medium">{area.name}</span>
                    <Badge
                      variant={area.type === 'primary' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {area.type}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{area.distance}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="font-medium">24/7 Emergency Response</p>
                  <p className="text-sm text-gray-600">{siteConfig.contact.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-sm text-gray-600">15-30 minutes in primary areas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="font-medium">Headquarters</p>
                  <p className="text-sm text-gray-600">
                    {siteConfig.contact.address.city}, {siteConfig.contact.address.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 2.2 AEO (Answer Engine Optimization)

**components/seo/faq-section.tsx**
```typescript
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { faqSchema } from '@/lib/seo/structured-data'

const securityFAQs = [
  {
    question: "What types of security services does Copperhead Consulting provide in Seattle?",
    answer: "Copperhead Consulting provides comprehensive security services including executive protection, private investigations, K9 detection services, risk assessments, surveillance, counter-surveillance, and 24/7 security operations center monitoring throughout the Seattle metro area and Pacific Northwest."
  },
  {
    question: "How quickly can Copperhead Consulting respond to security emergencies in Washington?",
    answer: "Our emergency response team can typically respond within 15-30 minutes in primary service areas including Seattle, Bellevue, and surrounding areas. We maintain 24/7 availability with strategically positioned teams throughout Washington state."
  },
  {
    question: "What qualifications do Copperhead Consulting security professionals have?",
    answer: "Our security professionals are highly trained with backgrounds in military, law enforcement, and private security. We maintain ISO 27001 certification, are licensed and bonded, and our team includes over 50 trained agents with 20+ years of combined experience in executive protection and security consulting."
  },
  {
    question: "Does Copperhead Consulting provide security services outside of Seattle?",
    answer: "Yes, while headquartered in Seattle, we provide security services throughout Washington state, Oregon, and can deploy teams nationally for executive protection and specialized security operations. Our primary service area covers a 100-mile radius from Seattle."
  },
  {
    question: "What industries does Copperhead Consulting serve for security consulting?",
    answer: "We serve diverse industries including technology companies, healthcare organizations, financial institutions, government agencies, entertainment, and high-net-worth individuals. Our clients include partnerships with Pinkerton, Microsoft, and other Fortune 500 companies."
  },
  {
    question: "How does Copperhead Consulting ensure confidentiality in private investigations?",
    answer: "We maintain strict confidentiality protocols with signed NDAs, secure communication channels, encrypted data storage, and compartmentalized information access. Our investigators are licensed professionals bound by legal and ethical confidentiality requirements."
  }
]

interface FAQSectionProps {
  title?: string
  faqs?: Array<{ question: string; answer: string }>
}

export function FAQSection({ title = "Frequently Asked Questions", faqs = securityFAQs }: FAQSectionProps) {
  return (
    <section className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(faqs)),
        }}
      />
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:text-orange-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
```

## Phase 3: Email Integration & Contact System

### 3.1 Email Service Setup

**lib/email/resend.ts**
```typescript
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set')
}

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactEmailData {
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  message: string
  type: 'contact' | 'quote' | 'subscription'
}

export async function sendContactEmail(data: ContactEmailData) {
  const recipientEmail = process.env.CONTACT_EMAIL || 'josh@copperheadci.com'
  
  const subject = {
    contact: 'New Contact Form Submission',
    quote: 'New Quote Request',
    subscription: 'New Newsletter Subscription'
  }[data.type]

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a1a; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; color: #ff6b35;">Copperhead Consulting Inc</h1>
        <p style="margin: 10px 0 0 0;">${subject}</p>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">
              <a href="mailto:${data.email}" style="color: #ff6b35;">${data.email}</a>
            </td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">
              <a href="tel:${data.phone}" style="color: #ff6b35;">${data.phone}</a>
            </td>
          </tr>
          ` : ''}
          ${data.company ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Company:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${data.company}</td>
          </tr>
          ` : ''}
          ${data.service ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Service:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${data.service}</td>
          </tr>
          ` : ''}
        </table>
        
        <h3 style="color: #333; margin-top: 30px;">Message</h3>
        <div style="background: white; padding: 20px; border-left: 4px solid #ff6b35; margin-top: 10px;">
          ${data.message.replace(/\n/g, '<br>')}
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #e8f4f8; border-radius: 5px;">
          <h4 style="margin: 0 0 10px 0; color: #333;">Quick Actions</h4>
          <p style="margin: 0;">
            <a href="mailto:${data.email}?subject=Re: ${subject}" 
               style="background: #ff6b35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Reply via Email</a>
            ${data.phone ? `<a href="tel:${data.phone}" 
               style="background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Call Now</a>` : ''}
          </p>
        </div>
      </div>
      
      <div style="background: #333; color: #ccc; padding: 20px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">This email was sent from the Copperhead Consulting website contact form.</p>
        <p style="margin: 5px 0 0 0;">Received: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: 'website@copperheadci.com',
      to: recipientEmail,
      replyTo: data.email,
      subject: `${subject} - ${data.name}`,
      html: emailHtml,
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function sendAutoReply(email: string, name: string, type: 'contact' | 'quote' | 'subscription') {
  const subjects = {
    contact: 'Thank you for contacting Copperhead Consulting',
    quote: 'Your quote request has been received',
    subscription: 'Welcome to Copperhead Consulting updates'
  }

  const messages = {
    contact: 'We have received your message and will respond within 24 hours.',
    quote: 'We have received your quote request and will provide a detailed proposal within 48 hours.',
    subscription: 'You have been successfully subscribed to our security insights newsletter.'
  }

  const autoReplyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a1a; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; color: #ff6b35;">Copperhead Consulting Inc</h1>
        <p style="margin: 10px 0 0 0;">Elite Security Solutions</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #333;">Hello ${name},</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          ${messages[type]}
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #ff6b35; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">What happens next?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #555;">
            <li>Our security experts will review your inquiry</li>
            <li>We'll contact you to discuss your specific needs</li>
            <li>A customized security solution will be proposed</li>
          </ul>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          For immediate assistance, please call us at <strong>(360) 519-9932</strong>.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://copperheadci.com" 
             style="background: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Our Website</a>
        </div>
      </div>
      
      <div style="background: #333; color: #ccc; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">Copperhead Consulting Inc</p>
        <p style="margin: 5px 0; font-size: 12px;">10002 Aurora Ave N Ste 36, PMB 432, Seattle, WA 98133</p>
        <p style="margin: 5px 0; font-size: 12px;">Phone: (360) 519-9932 | Email: info@copperheadci.com</p>
      </div>
    </div>
  `

  try {
    await resend.emails.send({
      from: 'noreply@copperheadci.com',
      to: email,
      subject: subjects[type],
      html: autoReplyHtml,
    })

    return { success: true }
  } catch (error) {
    console.error('Auto-reply send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
```

### 3.2 Enhanced Contact Form Action

**app/actions/contact.ts**
```typescript
'use server'

import { z } from 'zod'
import { sendContactEmail, sendAutoReply } from '@/lib/email/resend'
import { headers } from 'next/headers'
import { ratelimit } from '@/lib/ratelimit'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Please enter a valid email address').max(255, 'Email too long'),
  phone: z.string().optional().refine((val) => {
    if (!val) return true
    const phoneRegex = /^[\+]?[1-9][\d]{0,14}$/
    return phoneRegex.test(val.replace(/[\s\-\(\)]/g, ''))
  }, 'Please enter a valid phone number'),
  company: z.string().max(100, 'Company name too long').optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  type: z.enum(['contact', 'quote', 'subscription']),
  honeypot: z.string().optional(), // Bot detection
})

type ContactFormData = z.infer<typeof contactSchema>

export async function submitContactForm(data: ContactFormData) {
  try {
    // Bot detection - honeypot field should be empty
    if (data.honeypot) {
      return {
        success: false,
        message: 'Spam detected. Please try again.',
      }
    }

    // Rate limiting
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    
    const { success: rateLimitSuccess } = await ratelimit.limit(ip)
    if (!rateLimitSuccess) {
      return {
        success: false,
        message: 'Too many requests. Please wait a moment before trying again.',
      }
    }

    // Validate the form data
    const validatedData = contactSchema.parse(data)

    // Send email to business
    const emailResult = await sendContactEmail(validatedData)
    
    if (!emailResult.success) {
      throw new Error(emailResult.error || 'Failed to send email')
    }

    // Send auto-reply to user
    await sendAutoReply(validatedData.email, validatedData.name, validatedData.type)

    // Log successful submission (for analytics)
    console.log('[Contact Form] Successful submission:', {
      type: validatedData.type,
      service: validatedData.service,
      timestamp: new Date().toISOString(),
      ip,
    })

    const successMessages = {
      contact: 'Thank you for your message. We\'ll get back to you within 24 hours!',
      quote: 'Thank you for your quote request. We\'ll send you a detailed proposal within 48 hours!',
      subscription: 'Thank you for subscribing! You\'ll receive our latest security insights and updates.',
    }

    return {
      success: true,
      message: successMessages[validatedData.type],
    }
  } catch (error) {
    console.error('[Contact Form] Error:', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Please check your form data and try again.',
        errors: error.errors,
      }
    }

    return {
      success: false,
      message: 'Something went wrong. Please try again or call us at (360) 519-9932.',
    }
  }
}
```

## Environment Variables Setup

**.env.local**
```bash
# Email Configuration
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=josh@copperheadci.com

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GOOGLE_VERIFICATION_CODE=your_google_verification_code

# Rate Limiting
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Security
NEXT_PUBLIC_SITE_URL=https://copperheadci.com
```

## Package.json Updates

**package.json additions**
```json
{
  "dependencies": {
    "resend": "^3.2.0",
    "@upstash/ratelimit": "^1.0.0",
    "@upstash/redis": "^1.28.4",
    "web-vitals": "^3.5.2"
  }
}
```

This technical roadmap provides the foundation for implementing a professional, SEO-optimized, and high-performance CopperheadCI website. Each component is designed to work together to create a cohesive system that drives business results while maintaining technical excellence.