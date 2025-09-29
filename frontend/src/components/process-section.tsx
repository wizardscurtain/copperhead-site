"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { useEffect, useState, useRef } from "react"

const ClockIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <polyline points="12,6 12,12 16,14" strokeWidth={2} />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m12 1 3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" strokeWidth={2} />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
    />
  </svg>
)

const PlayIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="5,3 19,12 5,21" strokeWidth={2} />
  </svg>
)

export function ProcessSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const steps = [
    {
      number: "1",
      icon: ClockIcon,
      title: "24/7 Comms",
      description:
        "We have Operations Managers that are always monitoring lines for quick turnaround on team response times.",
    },
    {
      number: "2",
      icon: SettingsIcon,
      title: "Customized Response",
      description:
        "We work with you to bring a customized operational plan to best suit you as the client and your specific need for coverage.",
    },
    {
      number: "3",
      icon: UsersIcon,
      title: "Tier 1 Teams",
      description:
        "We strive to put the right agents in the right jobs and we accomplish this by having a wide variety of backgrounds always ready to deploy.",
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

  const handlePhoneCall = () => {
    window.location.href = "tel:(360)519-9932"
  }

  const handleGetInTouch = () => {
    const contactElement = document.getElementById("contact")
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section ref={sectionRef} id="process" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-6">
            On standby and ready for your needs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card
              key={index}
              className={`text-center h-full hover:shadow-lg hover:scale-105 transition-all duration-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <CardHeader>
                <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 hover:scale-110 transition-transform duration-200">
                  {step.number}
                </div>
                <div className="text-accent mx-auto mb-4">
                  <step.icon />
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div
          className={`bg-card rounded-lg p-8 md:p-12 transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">How We Work</h3>
              <p className="text-lg text-muted-foreground mb-2">
                Continually training to be the best team for our clients.
              </p>
              <h4 className="text-xl font-semibold mb-4">Comprehensive Risk Management</h4>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We leverage our years and years of law enforcement and military backgrounds to seamlessly integrate into
                any environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="hover:scale-105 transition-transform duration-200" onClick={handlePhoneCall}>
                  (360) 519-9932
                </Button>
                <Button
                  variant="outline"
                  className="hover:scale-105 transition-transform duration-200 bg-transparent"
                  onClick={handleGetInTouch}
                >
                  Get in Touch
                </Button>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                  <div className="text-black ml-1">
                    <PlayIcon />
                  </div>
                </div>
              </div>
              <img
                src="/images/surveillance-camera.jpg"
                alt="Professional surveillance and security operations"
                className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
