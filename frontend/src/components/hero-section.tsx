"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useEffect, useState } from "react"
const base = import.meta.env.BASE_URL || '/'

const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const CertificationBadges = () => (
  <div className="flex flex-wrap gap-3 mt-8">
    <Badge variant="outline" className="glass-effect px-4 py-2 text-sm font-medium">
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812z"
          clipRule="evenodd"
        />
      </svg>
      ISO 27001 Certified
    </Badge>
    <Badge variant="outline" className="glass-effect px-4 py-2 text-sm font-medium">
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Licensed & Bonded
    </Badge>
    <Badge variant="outline" className="glass-effect px-4 py-2 text-sm font-medium">
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
          clipRule="evenodd"
        />
      </svg>
      24/7 Response
    </Badge>
  </div>
)

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden min-h-screen flex items-center hero-section">
      <div className="absolute inset-0 z-0">
        <img
          src={`${base}images/seattle-space-needle.jpg`}
          alt="Seattle Space Needle - Copperhead Consulting headquarters location"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </div>

      <div className="absolute top-20 right-10 text-accent/30 animate-float">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-4xl">
            <div
              className={`flex items-center mb-6 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="text-accent mr-3 animate-pulse-glow">
                <ShieldIcon />
              </div>
              <span className="text-accent font-bold text-lg tracking-wide uppercase">Elite Security Solutions</span>
            </div>

            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 transition-all duration-1000 delay-200 text-white ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              On Standby and Ready for <span className="text-accent">Your Needs</span>
            </h1>

            <p
              className={`text-xl md:text-2xl text-gray-300 text-pretty mb-8 max-w-3xl leading-relaxed transition-all duration-1000 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Our mission is to deliver exceptional security, intelligence, and risk assessment solutions using
              cutting-edge technology and skilled senior professionals.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-1000 delay-600 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Button
                size="lg"
                className="primary-button-with-icon button-text text-lg px-8 py-4 bg-accent hover:bg-accent/90 text-white border-0"
                onClick={() => {
                  const servicesElement = document.getElementById("services")
                  if (servicesElement) {
                    servicesElement.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Learn More
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 glass-effect hover:scale-105 transition-all duration-200 border-accent/50 hover:border-accent text-white bg-transparent"
                onClick={() => (window.location.href = "tel:(360)519-9932")}
              >
                <PhoneIcon />
                <span className="ml-2">(360) 519-9932</span>
              </Button>
            </div>

            <div
              className={`transition-all duration-1000 delay-800 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <CertificationBadges />
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl border border-accent/20">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={`${base}images/soc-team.jpg`}
              >
                <source src={`${base}videos/soc-operations-demo.mp4`} type="video/mp4" />
                <source src={`${base}videos/soc-operations-demo.webm`} type="video/webm" />
                {/* Fallback image for browsers that don't support video */}
                <img
                  src={`${base}images/soc-team.jpg`}
                  alt="Copperhead Consulting Inc - Security Operations Center"
                  className="w-full h-full object-cover"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
