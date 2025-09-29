"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useEffect, useState, useRef } from "react"

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

const K9Icon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
)

const DroneIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const TruckIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
    />
  </svg>
)

const UserShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6"
    />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35" />
  </svg>
)

const AlertTriangleIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
)

const MonitorIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth={2} />
    <line x1="8" y1="21" x2="16" y2="21" strokeWidth={2} />
    <line x1="12" y1="17" x2="12" y2="21" strokeWidth={2} />
  </svg>
)

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const services = [
    {
      icon: ShieldIcon,
      title: "Tier 1 Security",
      description:
        "Superior 3:1 capability compared to standard guards, cutting-edge integrated communications, elite training in medical and life saving techniques our professionals are unmatched at the peak of their field.",
      badge: "Elite",
      backgroundImage: "/images/executive-protection.jpg",
    },
    {
      icon: K9Icon,
      title: "K9 Detection & Response",
      description:
        "We provide top-tier K9 detection services trusted by large-scale venues, festivals, and high-security events across the nation. From explosives and firearms to narcotics detection.",
      badge: "Certified",
      backgroundImage: "/images/training-session.jpg",
    },
    {
      icon: DroneIcon,
      title: "Surveillance & Robotics",
      description:
        "We combine cutting-edge robotics and drone technology with the critical thinking and adaptability of trained security professionals.",
      badge: "Advanced",
      backgroundImage: "/images/surveillance-camera.jpg",
    },
    {
      icon: TruckIcon,
      title: "Mobile Security Ops Center",
      description:
        "We deploy Mobile Security Ops Centers to bring real-time surveillance and command to the field. They enhance response, communication, and control wherever they're needed most.",
      badge: "24/7",
      backgroundImage: "/images/soc-team.jpg",
    },
    {
      icon: UserShieldIcon,
      title: "Executive Protection",
      description: "Elite, discreet protection for executives and high-profile clients—your safety, our priority.",
      badge: "Discreet",
      backgroundImage: "/images/executive-protection.jpg",
    },
    {
      icon: SearchIcon,
      title: "Private Investigations",
      description:
        "Confidential, thorough investigations tailored to your needs. We uncover the truth with professionalism and precision.",
      badge: "Confidential",
      backgroundImage: "/images/training-session.jpg",
    },
    {
      icon: AlertTriangleIcon,
      title: "Threat/Risk Assessments",
      description:
        "Proactive threat and risk assessments to safeguard your assets, and operations. We identify vulnerabilities before they become liabilities.",
      badge: "Proactive",
      backgroundImage: "/images/surveillance-camera.jpg",
    },
    {
      icon: MonitorIcon,
      title: "Security Operations Center",
      description:
        "Our 24/7 Security Operations Center delivers real-time monitoring and rapid response. Centralized intelligence to keep your operations secure and informed.",
      badge: "Real-time",
      backgroundImage: "/images/soc-team.jpg",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleAllServices = () => {
    // Scroll to contact section to get more information
    const contactElement = document.getElementById("contact")
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section ref={sectionRef} id="services" className="py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-6 text-white">Our services</h2>
          <p className="text-lg md:text-xl text-gray-300 text-pretty max-w-4xl mx-auto leading-relaxed">
            We deliver elite security solutions tailored for discerning clients. Our expertise spans high-end security
            consulting, executive protection, travel and residential, technical surveillance countermeasures (TSCM), and
            discreet private investigations.
          </p>
          <Button
            className="mt-8 primary-button-with-icon button-text bg-accent hover:bg-accent/90 text-white border-0"
            onClick={handleAllServices}
          >
            All Services
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`service-card-dark h-full relative overflow-hidden cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                backgroundImage: `url(${service.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/70" />

              <CardHeader className="relative z-10">
                <Badge className="absolute top-4 left-4 text-xs font-medium bg-accent text-white border-0">
                  {service.badge}
                </Badge>
                <div className="text-accent mb-4 group-hover:scale-110 transition-transform duration-200 mt-8">
                  <service.icon />
                </div>
                <CardTitle className="text-lg font-bold text-white">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-sm leading-relaxed text-gray-300">
                  {service.description}
                </CardDescription>
                <Button variant="link" className="mt-4 p-0 h-auto text-accent hover:text-accent/80 font-medium">
                  Learn More →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
