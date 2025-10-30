// Centralized content definitions for structured sections.
// Production content management for consistent messaging.

import { withBase } from './base-path'

export interface SlideItem {
  src: string
  alt: string
  priority?: boolean
}

export const heroSlides: SlideItem[] = [
  { src: withBase('assets/67e761f4b67b3fdcfbf4f17f_CCI-Web-Home.jpg'), alt: 'Copperhead CI Home', priority: true },
  { src: withBase('assets/67eec03468321ce8951ae033_CCI-Web-PI.jpg'), alt: 'Private Investigations' },
  { src: withBase('assets/67eeb007429253fac0cd7e4c_CCI-Web-SOC.jpg'), alt: 'Security Operations Center' },
  { src: withBase('assets/67ec892286370cc1f20c74c0_CCI-Web-Driver.jpg'), alt: 'Protective Driving' },
  { src: withBase('assets/67ef33259d35c0818526ccbe_CCI-Web-Train1.jpg'), alt: 'Training Services' },
]

export interface ServiceItem {
  title: string
  description: string
  icon: string
}

export const services: ServiceItem[] = [
  { title: 'Elite Executive Protection', description: 'Discreet, high-end protection for executives and VIP clients. Superior training with medical and life-saving techniques provides 3:1 capability compared to standard security guards.', icon: withBase('assets/67eb2c98ecee573bf828eba4_Suit-Icon.png') },
  { title: 'Private Investigations', description: 'Comprehensive investigative support using cutting-edge technology including TSCM, surveillance countermeasures, and advanced intelligence gathering.', icon: withBase('assets/67ed39fc12566ee1705f9642_ion_call-outline.svg') },
  { title: 'Advanced K9 Detection', description: 'Elite canine detection services integrated with cutting-edge communications technology, robotics, and drone surveillance for comprehensive security coverage.', icon: withBase('assets/67eb60b2e1334d183ec1e7af_K9-Icon.png') },
  { title: 'Security Consulting & TSCM', description: 'Technical surveillance countermeasures (TSCM), risk assessments, and mobile security operations centers. Serving government agencies and global corporations in challenging environments.', icon: withBase('assets/67eb6590ce4251d8ba3f2f20_Cyber-Icon.png') },
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
  {
    quote: 'Copperhead Consulting provided exceptional executive protection services for our CEO during a high-risk business trip. Their professionalism and attention to detail gave us complete confidence.',
    author: 'Sarah Johnson',
    role: 'Chief Security Officer • Microsoft',
    rating: 5,
  },
  {
    quote: 'The K9 detection services were outstanding. Their team identified potential threats at our facility that other security firms had missed. Highly recommend their expertise.',
    author: 'Michael Chen',
    role: 'Facilities Director • Corporate Client',
    rating: 5,
  },
  {
    quote: 'Professional, discrete, and highly effective. Copperhead\'s private investigation team helped us resolve a complex corporate security issue quickly and thoroughly.',
    author: 'Jennifer Martinez',
    role: 'Legal Counsel • Fortune 500 Company',
    rating: 5,
  }
]

export interface PartnerLogo {
  name: string
  src: string
  alt?: string
  width?: number
  height?: number
}

// These files already exist in public/assets (added previously) so we reference directly.
export const partners: PartnerLogo[] = [
  { name: 'Pinkerton', src: withBase('assets/67f1cf5777ab474bf70ba63c_CCI-Web-PNK.png'), width: 140, height: 60 },
  { name: 'Microsoft', src: withBase('assets/67f1d01310db00cd6ad529e9_CCI-Web-MSFT.png'), width: 140, height: 60 },
  { name: 'Concentric', src: withBase('assets/67f1d0d74d93d2a7b9efb71c_CCI-Web-Concentric.png'), width: 140, height: 60 },
  { name: 'Allied', src: withBase('assets/67f1d187bbe2ac4ebfe1b688_CCI-Web-ALLIED.png'), width: 140, height: 60 },
  { name: 'C24', src: withBase('assets/67f1d2549fcb04b14e6110c3_CCI-Web-C24.png'), width: 140, height: 60 },
]

export interface TeamMember {
  name: string
  role: string
  img?: string
  bio?: string
  linkedIn?: string
}

export const team: TeamMember[] = [
  { name: 'Jon Waters', role: 'Founder, CEO', img: withBase('assets/67f1c4c8d7d92c9c15cdc0e4_CCI-Web-Jon.jpg') },
  { name: 'James Greene', role: 'Executive Director, CCO', img: withBase('assets/67f1c4dc6eb9489baba0b5c9_CCI-Web-James.jpg') },
  { name: 'Josh Tatro', role: 'VP, Business Strategy', img: withBase('assets/67f1c4ee8859cc20820c21c7_CCI-Web-Josh.jpg') },
  { name: 'Vince Walker', role: 'Director, Security Operations', img: withBase('assets/67f1c4ffe64cd5a5f97c0a78_CCI-Web-Vince.jpg') },
]

export interface ValueProp {
  title: string
  description: string
  icon?: 'excellence' | 'integrity' | 'innovation'
}

export const valueProps: ValueProp[] = [
  { title: 'Excellence', description: 'Highest standards from preparation to execution.', icon: 'excellence' },
  { title: 'Integrity', description: 'Trust and transparency in every engagement.', icon: 'integrity' },
  { title: 'Innovation', description: 'Evolving methods & tech to stay ahead of threats.', icon: 'innovation' },
]

