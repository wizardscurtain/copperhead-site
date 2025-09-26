// Centralized content definitions for structured sections.
// Facilitates v0.app AI editing by keeping a single source-of-truth.

export interface SlideItem {
  src: string
  alt: string
  priority?: boolean
}

export const heroSlides: SlideItem[] = [
  { src: '/assets/67e761f4b67b3fdcfbf4f17f_CCI-Web-Home.jpg', alt: 'Copperhead CI Home', priority: true },
  { src: '/assets/67eec03468321ce8951ae033_CCI-Web-PI.jpg', alt: 'Private Investigations' },
  { src: '/assets/67eeb007429253fac0cd7e4c_CCI-Web-SOC.jpg', alt: 'Security Operations Center' },
  { src: '/assets/67ec892286370cc1f20c74c0_CCI-Web-Driver.jpg', alt: 'Protective Driving' },
  { src: '/assets/67ef33259d35c0818526ccbe_CCI-Web-Train1.jpg', alt: 'Training Services' },
]

export interface ServiceItem {
  title: string
  description: string
  icon: string
}

export const services: ServiceItem[] = [
  { title: 'Executive Protection', description: 'Discrete, professional executive & VIP protection services.', icon: '/assets/67db459955ee8b93594b4101_Guard.webp' },
  { title: 'Private Investigations', description: 'Confidential, comprehensive investigative support.', icon: '/assets/67db459955ee8b93594b4101_Investigation.webp' },
  { title: 'Training', description: 'Professional security training programs & preparedness.', icon: '/assets/67db459955ee8b93594b4101_Training.webp' },
  { title: 'Security Consulting', description: 'Holistic risk, threat, & security posture assessments.', icon: '/assets/67db459955ee8b93594b4101_Consulting.webp' },
]

export interface TestimonialItem {
  quote: string
  author: string
  role?: string
  rating?: number
}

export const testimonials: TestimonialItem[] = [
  {
    quote: 'Rapid deployment in a high demand market, proper backgrounds, solid agents... High tier delivery on first engagement. Looking forward to continued service.',
    author: 'Associate Director of Operations',
    role: 'Pinkerton',
    rating: 5,
  },
]
