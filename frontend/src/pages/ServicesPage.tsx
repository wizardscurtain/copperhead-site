import React from 'react'
import { ServicesGrid } from '../components/services-grid'
import { CTAButton } from '../components/cta-buttons'

export default function ServicesPage() {
  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Professional Security Services
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive security solutions backed by decades of experience and cutting-edge technology
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesGrid />
          
          <div className="text-center mt-16">
            <CTAButton 
              href="/contact"
              className="bg-accent hover:bg-accent/90 text-white font-semibold py-4 px-12 rounded-lg transition-all duration-300 text-lg"
            >
              Request Consultation
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Additional Service Information */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Why Choose Copperhead Consulting?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Proven Experience</h3>
                <p className="text-gray-300">Over 20 years of combined security experience with government and corporate clients.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Elite Training</h3>
                <p className="text-gray-300">Superior training with medical and life-saving techniques providing 3:1 capability vs standard guards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}