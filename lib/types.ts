// TypeScript type definitions for CopperheadCI website
// Professional type safety implementation

export interface ServiceItem {
  id: string
  title: string
  description: string
  longDescription?: string
  icon: string
  image?: string
  features?: string[]
  pricing?: {
    type: 'quote' | 'hourly' | 'project'
    baseRate?: number
    currency?: string
  }
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  image?: string
  credentials?: string[]
  linkedIn?: string
  email?: string
  specialties?: string[]
}

export interface TestimonialItem {
  id: string
  quote: string
  author: string
  role?: string
  company?: string
  rating?: number
  image?: string
  verified?: boolean
}

export interface PartnerLogo {
  id: string
  name: string
  src: string
  alt: string
  width: number
  height: number
  url?: string
}

export interface SlideItem {
  id: string
  src: string
  alt: string
  title?: string
  description?: string
  priority?: boolean
  cta?: {
    text: string
    url: string
  }
}

export interface ContactForm {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  services?: string[]
  budget?: string
  timeline?: string
  source?: string
}

export interface QuoteRequest extends ContactForm {
  serviceType: string
  duration?: string
  location?: string
  urgency: 'low' | 'medium' | 'high' | 'emergency'
  additionalDetails?: string
}

// SEO Types
export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  schemaMarkup?: object
  noindex?: boolean
  nofollow?: boolean
}

// Page-specific types
export interface PageProps {
  params?: { [key: string]: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

// Component Props
export interface HeroSectionProps {
  title: string
  subtitle: string
  backgroundImage?: string
  backgroundVideo?: string
  cta?: {
    primary: { text: string; url: string }
    secondary?: { text: string; url: string }
  }
}

export interface CTAButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
  disabled?: boolean
  className?: string
}

// Analytics Types
export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  nonInteraction?: boolean
}

// Location/Address Types
export interface Address {
  street: string
  city: string
  state: string
  zip: string
  country?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

// Business Schema Types
export interface LocalBusiness {
  '@type': 'LocalBusiness' | 'SecurityService' | 'ProfessionalService'
  name: string
  description: string
  url: string
  telephone: string
  email: string
  address: Address
  geo: {
    '@type': 'GeoCoordinates'
    latitude: number
    longitude: number
  }
  openingHours: string[]
  serviceArea: {
    '@type': 'GeoCircle' | 'AdministrativeArea'
    geoMidpoint?: {
      '@type': 'GeoCoordinates'
      latitude: number
      longitude: number
    }
    geoRadius?: string
    addressRegion?: string
  }
  sameAs?: string[]
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: number
    reviewCount: number
  }
}
