import { siteConfig } from './config'

export interface ServiceSchemaData {
  name: string
  description: string
  category?: string
}

export function generateServiceSchema(service: ServiceSchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url
    },
    areaServed: {
      '@type': 'State',
      name: 'Washington'
    },
    category: service.category || 'Security Services'
  }
}

export const coreServices: ServiceSchemaData[] = [
  {
    name: 'Elite Executive Protection',
    description: 'Discreet, high-end protection for executives and VIP clients. Superior training with medical and life-saving techniques provides 3:1 capability compared to standard security guards.',
    category: 'Executive Protection'
  },
  {
    name: 'Private Investigations',
    description: 'Comprehensive investigative support using cutting-edge technology including TSCM, surveillance countermeasures, and advanced intelligence gathering.',
    category: 'Private Investigation'
  },
  {
    name: 'Advanced K9 Detection',
    description: 'Elite canine detection services integrated with cutting-edge communications technology, robotics, and drone surveillance for comprehensive security coverage.',
    category: 'K9 Security Services'
  },
  {
    name: 'Security Consulting & TSCM',
    description: 'Technical surveillance countermeasures (TSCM), risk assessments, and mobile security operations centers. Serving government agencies and global corporations in challenging environments.',
    category: 'Security Consulting'
  }
]
