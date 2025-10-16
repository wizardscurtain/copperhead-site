import HeroCarousel from '../components/hero-carousel'
import { PartnersStrip } from '../components/partners-strip'
import { TestimonialsSection } from '../components/testimonials'
import { ServicesGrid } from '../components/services-grid'
import { CTAButton } from '../components/cta-buttons'
import { StatsBar } from '../components/stats-bar'
import { usePageSEO } from '../hooks/usePageSEO'

export default function HomePage() {
  usePageSEO(
    'Copperhead Consulting Inc - Professional Security Services',
    'Elite executive protection, security consulting, private investigations and K9 detection services by veteran-owned professionals.',
    '/'
  )

  return (
    <>
      {/* Professional Hero Section */}
      <section 
        className="hero-section-professional" 
        aria-label="Hero section"
      >
        {/* Hero Carousel */}
        <HeroCarousel />
        
        <div className="hero-content-container">
          <div className="hero-content-wrapper">
            <h1 className="hero-main-heading">
              Elite Security Solutions
            </h1>
            <p className="hero-description">
              With over 20 years of experience and 50+ trained agents, we deliver discreet, 
              high-end executive protection and security consulting using cutting-edge technology 
              including K9 detection, robotics, drones, and mobile security operations centers.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <CTAButton 
                href="/about"
                className="bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                Learn More About Us
              </CTAButton>
              
              <CTAButton 
                href="/contact"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 border border-white/30"
              >
                Get Started
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats Bar */}
      <StatsBar />

      {/* Partners Section */}
      <PartnersStrip />

      {/* Services Section */}
      <section className="py-20 bg-slate-900" aria-labelledby="services-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="services-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive security solutions tailored to your specific needs
            </p>
          </div>
          <ServicesGrid />
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <section className="py-20 bg-slate-800" aria-labelledby="faq-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-8">
            <div className="border-b border-slate-700 pb-6">
              <dt className="text-xl font-semibold text-white mb-3">
                What does a security consultant do?
              </dt>
              <dd className="text-gray-300 leading-relaxed">
                A security consultant assesses risks, develops security protocols, provides executive protection, conducts investigations, and implements comprehensive security solutions for businesses and individuals.
              </dd>
            </div>
            <div className="border-b border-slate-700 pb-6">
              <dt className="text-xl font-semibold text-white mb-3">
                What areas does Copperhead Consulting serve?
              </dt>
              <dd className="text-gray-300 leading-relaxed">
                Copperhead Consulting serves Seattle, the Pacific Northwest region, Washington State, and Oregon with comprehensive security consulting and protection services.
              </dd>
            </div>
            <div className="pb-6">
              <dt className="text-xl font-semibold text-white mb-3">
                Are Copperhead Consulting's services available 24/7?
              </dt>
              <dd className="text-gray-300 leading-relaxed">
                Yes, Copperhead Consulting provides 24/7 emergency response services with immediate deployment capabilities for urgent security situations.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  )
}