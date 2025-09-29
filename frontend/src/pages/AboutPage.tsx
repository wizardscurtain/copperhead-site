import React from 'react'
import { TeamGrid } from '../components/team-grid'
import { ValuesSection } from '../components/values-section'
import { CTAButton } from '../components/cta-buttons'

export default function AboutPage() {
  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About Copperhead Consulting
            </h1>
            <p className="text-xl text-gray-300">
              Elite security professionals with decades of experience
            </p>
          </div>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-6 text-gray-300">
              Copperhead Consulting Inc was founded to provide elite, discreet security solutions for discerning clients. 
              With over 20 years of collective experience and 50+ trained agents, our team delivers superior training 
              with medical and life-saving techniques, providing a 3:1 capability compared to standard security guards.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-gray-300">
              We utilize cutting-edge integrated communications technology, K9 detection, robotics, drones, and mobile 
              security operations centers to provide real-time surveillance, response, and control. Our services include 
              technical surveillance countermeasures (TSCM) and comprehensive risk assessments for challenging environments.
            </p>
            <p className="text-lg leading-relaxed mb-8 text-gray-300">
              Serving government agencies, global corporations, and high-profile executives, we operate with utmost 
              discretion and precision in sensitive environments requiring the highest levels of security and professionalism.
            </p>
            
            <div className="text-center">
              <CTAButton 
                href="/contact"
                className="bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                Get In Touch
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <TeamGrid />

      {/* Values */}
      <ValuesSection />
    </div>
  )
}