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
        {/* Enhanced Hero Section with SEO */}
        <section 
          className="section-home-hero" 
          aria-label="Hero section"
          itemScope 
          itemType="https://schema.org/Organization"
        >
          <div className="home-hero-container">
            <div className="home-hero-left">
              <div className="home-hero-content">
                <h1 className="home-hero-heading" itemProp="name">
                  COPPERHEAD<br />
                  CONSULTING<br />
                  <span className="orange-text">INC.</span>
                </h1>
                <div className="home-hero-text" itemProp="description">
                  Veteran-owned and operated executive and personal protection, security consulting, 
                  private investigations and training. Serving the Pacific Northwest, Washington State and Oregon.
                </div>
                
                {/* Enhanced CTA with analytics tracking */}
                <div className="button-hero-wrapper">
                  <Link 
                    href="#services" 
                    className="primary-button-with-icon w-inline-block"
                    onClick={() => {
                      if (typeof window !== 'undefined' && 'gtag' in window) {
                        (window as any).gtag('event', 'hero_cta_click', {
                          event_category: 'engagement',
                          event_label: 'watch_video_cta'
                        })
                      }
                    }}
                    aria-label="Learn about our security services"
                  >
                    <p className="button-white-text">Our Services</p>
                    <div className="icons-wrapper" aria-hidden="true">
                      <Image
                        src="/assets/67db459955ee8b93594b40fd_Play.webp"
                        alt=""
                        width={20}
                        height={20}
                        className="link-icon-white"
                        loading="eager"
                        priority
                      />
                      <Image
                        src="/assets/67ed9c3f382e7903ed6c91bc_mdi_play.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="link-icon-red"
                        loading="eager"
                        priority
                      />
                    </div>
                    <div className="white-btn-ov" aria-hidden="true"></div>
                  </Link>
                  
                  {/* Emergency contact CTA */}
                  <Link 
                    href={`tel:${siteConfig.contact.phone.primary}`}
                    className="ml-4 inline-flex items-center px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-full font-semibold transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      if (typeof window !== 'undefined' && 'gtag' in window) {
                        (window as any).gtag('event', 'emergency_call', {
                          event_category: 'conversion',
                          event_label: 'hero_phone_click'
                        })
                      }
                    }}
                  >
                    🚨 Emergency: {siteConfig.contact.phone.primary}
                  </Link>
                </div>
                
                {/* Trust indicators */}
                <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>24/7 Emergency Response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Veteran Owned & Operated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Licensed & Bonded</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="home-hero-right">
              <Suspense fallback={<HeroSliderFallback />}>
                <HeroSlider />
              </Suspense>
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

        {/* Testimonials with enhanced loading */}
        <Suspense fallback={<div className="py-16 bg-muted/20 animate-pulse" />}>
          <TestimonialsSection />
        </Suspense>

        {/* Services section with enhanced SEO */}
        <section id="services" aria-label="Our security services">
          <Suspense fallback={<ServicesFallback />}>
            <ServicesGrid />
          </Suspense>
        </section>

        {/* Local service areas for SEO */}
        <section className="py-16 bg-muted/10" aria-label="Service areas">
          <div className="base-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Serving the Pacific Northwest</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Professional security consulting and protection services across Washington State and Oregon
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { city: 'Seattle', state: 'WA', description: 'Executive Protection & Security Consulting' },
                { city: 'Bellevue', state: 'WA', description: 'Corporate Security Solutions' },
                { city: 'Tacoma', state: 'WA', description: 'Risk Assessment & Training' },
                { city: 'Portland', state: 'OR', description: 'Private Investigation Services' }
              ].map((location) => (
                <div key={`${location.city}-${location.state}`} className="group">
                  <div className="bg-card p-6 rounded-lg border border-border hover:border-accent transition-colors">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                      {location.city}, {location.state}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {location.description}
                    </p>
                  </div>
                </div>
              ))}\n            </div>
            
            {/* Local SEO content for AI crawlers */}
            <div className="sr-only">
              <h3>Security Services in Seattle Washington</h3>
              <p>
                Copperhead Consulting provides comprehensive security consulting services in Seattle, 
                including executive protection, private investigations, risk assessment, and security training.
                Our veteran-owned firm serves the greater Seattle metropolitan area with 24/7 emergency response.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
