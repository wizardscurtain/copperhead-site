import React from 'react'
import HeroCarousel from '../components/hero-carousel'
import { PartnersStrip } from '../components/partners-strip'
import { TestimonialsSection } from '../components/testimonials'
import { ServicesGrid } from '../components/services-grid'
import { CTAButton } from '../components/cta-buttons'
import { StatsBar } from '../components/stats-bar'

export default function HomePage() {
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
              
              {/* Video Play Button */}
              <button className="flex items-center text-white hover:text-accent transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-2">
                  <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <span className="font-medium">Watch</span>
              </button>
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
    </>
  )
}