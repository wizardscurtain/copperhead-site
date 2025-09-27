import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import HeroSlider from '../components/hero-slider'
import Footer from '../components/footer'
import { PartnersStrip } from '@/components/partners-strip'
import { TestimonialsSection } from '@/components/testimonials'
import { ServicesGrid } from '@/components/services-grid'
import { CTAButton, EmergencyCallButton } from '@/components/cta-buttons'
import { siteConfig } from '@/lib/config'
import { generateSEOTags, generateFAQSchema, aeoContent } from '@/lib/seo'

// Enhanced SEO for homepage
const seoData = generateSEOTags({
  title: `${siteConfig.name} | Professional Security Consulting & Executive Protection`,
  description: `Veteran-owned security consulting firm providing executive protection, private investigations, risk assessment, and security training in Seattle, Washington and the Pacific Northwest.`,
  keywords: [
    'security consulting Seattle',
    'executive protection Washington',
    'private investigation services',
    'veteran owned security company',
    'Pacific Northwest security services',
    'corporate security consulting',
    'risk assessment Seattle',
    'security training programs'
  ]
})

export const metadata: Metadata = seoData

// Loading fallbacks for performance
function HeroSliderFallback() {
  return (
    <div className="slider-3 bg-muted animate-pulse">
      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
    </div>
  )
}

function ServicesFallback() {
  return (
    <div className="services-section">
      <div className="base-container">
        <div className="section-heading animate-pulse bg-muted h-8 w-64 mx-auto mb-8" />
        <div className="services-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="service-item animate-pulse">
              <div className="service-icon-wrapper">
                <div className="w-16 h-16 bg-muted rounded" />
              </div>
              <div className="h-6 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded mb-1" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const faqSchema = generateFAQSchema(aeoContent.securityConsultingFAQ)

  return (
    <>
      {/* FAQ Schema for AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="homepage">
        {/* FAQ Schema for AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        
        {/* Professional Hero Section - Client Focused */}
        <section 
          className="hero-section-professional" 
          aria-label="Hero section"
          itemScope 
          itemType="https://schema.org/Organization"
        >
          {/* Background Image */}
          <div className="hero-background">
            <Image
              src="/assets/67eec03468321ce8951ae033_CCI-Web-PI.jpg"
              alt="Professional security team"
              fill
              className="object-cover"
              priority
              quality={85}
            />
            <div className="hero-overlay" />
          </div>
          
          <div className="hero-content-container">
            <div className="hero-content-wrapper">
              <h1 className="hero-main-heading">
                We Value Your Safety
              </h1>
              <p className="hero-description">
                Our mission is to deliver exceptional security, intelligence, and risk assessment 
                solutions using cutting-edge technology and skilled senior professionals.
              </p>
              
              {/* Single Strong CTA */}
              <div className="hero-cta-wrapper">
                <CTAButton 
                  href="/contact"
                  eventLabel="hero_learn_more_cta"
                  className="hero-primary-cta"
                >
                  Learn More
                </CTAButton>
              </div>
            </div>
          </div>
          
          {/* Structured data for location */}
          <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress" className="sr-only">
            <span itemProp="streetAddress">{siteConfig.contact.addresses.seattle.street}</span>
            <span itemProp="addressLocality">{siteConfig.contact.addresses.seattle.city}</span>
            <span itemProp="addressRegion">{siteConfig.contact.addresses.seattle.state}</span>
            <span itemProp="postalCode">{siteConfig.contact.addresses.seattle.zip}</span>
          </div>
        </section>

        {/* Partners section with enhanced loading */}
        <Suspense fallback={<div className="py-16 bg-muted/20 animate-pulse" />}>
          <PartnersStrip />
        </Suspense>

        {/* Services section with enhanced SEO */}
        <section id="services" aria-label="Our security services" className="py-20">
          <Suspense fallback={<ServicesFallback />}>
            <ServicesGrid />
          </Suspense>
        </section>

        <Footer />
      </div>
    </>
  )
}
