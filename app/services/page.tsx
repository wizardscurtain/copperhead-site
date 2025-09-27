import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Footer from "../../components/footer"
import { siteConfig } from '@/lib/config'
import { generateSEOTags } from '@/lib/seo'

// Enhanced SEO for services page
const seoData = generateSEOTags({
  title: 'Security Services | Executive Protection, Investigations, Risk Assessment',
  description: 'Professional security consulting services including executive protection, private investigations, K9 detection, cybersecurity, and risk assessment in Seattle and Pacific Northwest.',
  keywords: [
    'executive protection services',
    'private investigation Seattle',
    'security consulting Washington',
    'K9 detection services',
    'cybersecurity consulting',
    'risk assessment services'
  ]
})

export const metadata: Metadata = seoData

// Professional services data
const professionalServices = [
  {
    id: 'executive-protection',
    title: 'Executive Protection',
    description: 'Discrete, professional executive & VIP protection services for high-profile individuals and corporate leaders.',
    icon: '/assets/67eb2c98ecee573bf828eba4_Suit-Icon.png',
    image: '/assets/67eee3a52eb9e3766d0f8b92_CCI-Web-K9.jpg',
    features: [
      'Close protection for executives and VIPs',
      'Travel security coordination',
      'Threat assessment and mitigation',
      'Residential security consultation'
    ]
  },
  {
    id: 'investigations',
    title: 'Private Investigations',
    description: 'Confidential, comprehensive investigative services for corporate and personal matters.',
    icon: '/assets/67ed39fc12566ee1705f9642_ion_call-outline.svg',
    image: '/assets/67eec03468321ce8951ae033_CCI-Web-PI.jpg',
    features: [
      'Corporate due diligence',
      'Background investigations',
      'Fraud investigation',
      'Surveillance operations'
    ]
  },
  {
    id: 'k9-detection',
    title: 'K9 Detection Services',
    description: 'Specialized canine units for explosive, narcotic, and contraband detection at events and facilities.',
    icon: '/assets/67eb60b2e1334d183ec1e7af_K9-Icon.png',
    image: '/assets/67eee4f6d8505637ff5a988a_CCI-Web-T%26R.jpg',
    features: [
      'Explosive detection',
      'Narcotic detection',
      'Event security screening',
      'Facility sweeps'
    ]
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    description: 'Comprehensive security assessments and vulnerability analysis for businesses and individuals.',
    icon: '/assets/67eb2c98ecee573bf828eba4_Suit-Icon.png',
    image: '/assets/67ef5905588f5577ef47b0f7_CCI-AI-2.jpg',
    features: [
      'Threat and vulnerability assessments',
      'Security program development',
      'Emergency response planning',
      'Security training programs'
    ]
  },
  {
    id: 'technology-solutions',
    title: 'Technology Solutions',
    description: 'Advanced robotics, drone technology, and integrated communications for enhanced security operations.',
    icon: '/assets/67eb61b4b095ffb7f4f36c18_Drone-Icon.png',
    image: '/assets/67efec7a9d9a9911822c0884_CCI-Web-Robotics.jpg',
    features: [
      'Drone surveillance operations',
      'Robotics-enhanced security',
      'Integrated communications',
      'Advanced surveillance systems'
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Technical surveillance countermeasures (TSCM) and digital security solutions.',
    icon: '/assets/67eb6590ce4251d8ba3f2f20_Cyber-Icon.png',
    image: '/assets/67eeb007429253fac0cd7e4c_CCI-Web-SOC.jpg',
    features: [
      'Technical surveillance countermeasures',
      'Digital forensics',
      'Cyber threat assessment',
      'Secure communications'
    ]
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Professional Hero Section */}
      <section className="services-hero-section">
        <div className="services-hero-background">
          <Image
            src="/assets/67eeb007429253fac0cd7e4c_CCI-Web-SOC.jpg"
            alt="Security Operations Center"
            fill
            className="object-cover"
            priority
            quality={85}
          />
          <div className="services-hero-overlay" />
        </div>
        
        <div className="services-hero-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="services-hero-text">
              <h1 className="services-hero-title">
                We Are Always Ready To Help Your Problems
              </h1>
              <p className="services-hero-description">
                Comprehensive security solutions delivered by experienced professionals 
                using cutting-edge technology and proven methodologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Professional Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Elite security consulting and protection services tailored to your specific needs, 
              delivered by veteran professionals with extensive operational experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {professionalServices.map((service, index) => (
              <div key={service.id} className="professional-service-card">
                <div className="service-image-container">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={600}
                    height={400}
                    className="service-image"
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>
                
                <div className="service-content">
                  <div className="service-icon-wrapper">
                    <Image
                      src={service.icon}
                      alt=""
                      width={60}
                      height={60}
                      className="service-icon"
                    />
                  </div>
                  
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <ul className="service-features">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="service-feature">
                        <span className="feature-bullet">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="service-cta">
                    <Link
                      href="/contact"
                      className="service-cta-button"
                    >
                      Get Consultation
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Secure Your Organization?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact our security experts today to discuss your specific needs and 
              learn how we can help protect what matters most to your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="cta-primary-button"
              >
                Start Consultation
              </Link>
              <Link
                href={`tel:${siteConfig.contact.phone.primary}`}
                className="cta-secondary-button"
              >
                Call {siteConfig.contact.phone.primary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
