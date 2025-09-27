// SEO optimization utilities and schema markup
// Production-ready SEO implementation

import { siteConfig } from './config'
import type { SEOData, LocalBusiness } from './types'

// Generate comprehensive meta tags
export function generateSEOTags(data: SEOData) {
  const {
    title,
    description, 
    keywords,
    canonicalUrl,
    ogImage,
    noindex = false,
    nofollow = false
  } = data

  const fullTitle = title.includes(siteConfig.name) 
    ? title 
    : `${title} | ${siteConfig.name}`

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(', '),
    canonical: canonicalUrl || siteConfig.url,
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl || siteConfig.url,
      siteName: siteConfig.name,
      images: [{
        url: ogImage || siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: title,
      }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage || siteConfig.ogImage],
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
    }
  }
}

// Generate local business schema markup
export function generateLocalBusinessSchema(): LocalBusiness {
  return {
    '@type': 'SecurityService',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone.primary,
    email: atob(siteConfig.contact.emailObfuscated), // Decode obfuscated email
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.addresses.seattle.street,
      addressLocality: siteConfig.contact.addresses.seattle.city,
      addressRegion: siteConfig.contact.addresses.seattle.state,
      postalCode: siteConfig.contact.addresses.seattle.zip,
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.seo.location.coordinates.latitude,
      longitude: siteConfig.seo.location.coordinates.longitude
    },
    openingHours: [
      'Mo-Fr 08:00-18:00',
      'Sa 09:00-16:00'
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: siteConfig.seo.location.coordinates.latitude,
        longitude: siteConfig.seo.location.coordinates.longitude
      },
      geoRadius: '100 mi'
    },
    sameAs: [
      siteConfig.links.linkedin
    ]
  }
}

// Generate service-specific schema
export function generateServiceSchema(serviceName: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url
    },
    areaServed: {
      '@type': 'State',
      name: 'Washington'
    },
    category: 'Security Services'
  }
}

// Generate FAQ schema for AEO
export function generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// AEO (Answer Engine Optimization) content helpers
export const aeoContent = {
  // Common questions about security consulting
  securityConsultingFAQ: [
    {
      question: "What does a security consultant do?",
      answer: "A security consultant assesses risks, develops security protocols, provides executive protection, conducts investigations, and implements comprehensive security solutions for businesses and individuals."
    },
    {
      question: "How much does executive protection cost in Seattle?",
      answer: "Executive protection costs vary based on threat level, duration, and specific requirements. Contact Copperhead Consulting for a customized quote based on your security needs."
    },
    {
      question: "What areas does Copperhead Consulting serve?",
      answer: "Copperhead Consulting serves Seattle, the Pacific Northwest region, Washington State, and Oregon with comprehensive security consulting and protection services."
    },
    {
      question: "Are Copperhead Consulting's services available 24/7?",
      answer: "Yes, Copperhead Consulting provides 24/7 emergency response services with immediate deployment capabilities for urgent security situations."
    }
  ],
  
  // How-to content for AI crawlers
  howToContent: {
    chooseSecurityConsultant: {
      name: "How to Choose a Security Consultant",
      steps: [
        "Verify credentials and certifications",
        "Review experience in your industry",
        "Check client testimonials and case studies",
        "Evaluate 24/7 availability and response times",
        "Assess technology and methodologies used",
        "Compare comprehensive service offerings"
      ]
    },
    securityAssessment: {
      name: "How to Conduct a Security Risk Assessment",
      steps: [
        "Identify valuable assets and potential vulnerabilities",
        "Analyze current security measures and gaps",
        "Evaluate threat probability and impact",
        "Develop risk mitigation strategies",
        "Implement security protocols and procedures",
        "Monitor and regularly update security measures"
      ]
    }
  }
}

// Local SEO optimization
export const localSEO = {
  businessCategories: [
    'Security Guard Service',
    'Security System Service', 
    'Private Investigation Service',
    'Business Consultant',
    'Corporate Office'
  ],
  
  serviceKeywords: {
    seattle: [
      'security consultant Seattle',
      'executive protection Seattle',
      'private investigator Seattle',
      'corporate security Seattle',
      'risk assessment Seattle'
    ],
    washington: [
      'security consulting Washington State',
      'executive protection Washington',
      'private investigation Washington',
      'security services Pacific Northwest'
    ]
  },
  
  locationPages: [
    { city: 'Seattle', state: 'WA', services: ['Executive Protection', 'Security Consulting', 'Private Investigation'] },
    { city: 'Bellevue', state: 'WA', services: ['Corporate Security', 'Risk Assessment'] },
    { city: 'Tacoma', state: 'WA', services: ['Security Consulting', 'Training Services'] },
    { city: 'Portland', state: 'OR', services: ['Executive Protection', 'Private Investigation'] }
  ]
}
