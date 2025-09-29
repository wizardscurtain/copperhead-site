"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState, useRef } from "react"

const QuoteIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12a4 4 0 018 0c0 1.5-.5 3-1.5 4.5S12 18 10 18s-3.5-1-4.5-2.5S4 13.5 4 12a8 8 0 018-8c2.5 0 4.5 1 6 2.5"
    />
  </svg>
)

export function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0) // Added slider state
  const sectionRef = useRef<HTMLElement>(null)

  const testimonials = [
    {
      quote:
        "Rapid deployment in a high demand market, proper backgrounds, solid agents...High Tier delivery to new and existing clients on first delivery...Looking forward to continued service.",
      author: "Pinkerton",
      role: "Associate Director of Operations Seattle",
      isOrange: true, // Alternating orange/dark backgrounds
    },
    {
      quote:
        "It felt so good to have CCI. We all felt safe, comfortable and thank you for being respectful of our space and privacy to our parents and guarding our kids!",
      author: "KinderCare Seattle",
      role: "Center Director",
      isOrange: false,
    },
    {
      quote: "Securing our future and making our kids feel safe, we couldn't have asked for a better service.",
      author: "Seattle Monastery",
      role: "Principal",
      isOrange: true,
    },
    {
      quote:
        "Produces highly competent and capable agents to support our high-net-worth clients ... We appreciate your responsiveness to cover down quickly as needed & professionalism of CCI agents",
      author: "Concentric Advisors",
      role: "Director of Operations",
      isOrange: false,
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section ref={sectionRef} id="testimonials" className="py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-6 text-white">Testimonials</h2>
          <p className="text-lg text-gray-300">What our clients say about our services</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <Card
                    className={`h-full border-0 ${testimonial.isOrange ? "testimonial-orange" : "testimonial-dark"}`}
                  >
                    <CardHeader>
                      <div className="text-white/80 mb-4">
                        <QuoteIcon />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <CardDescription className="text-lg leading-relaxed italic text-white">
                        "{testimonial.quote}"
                      </CardDescription>
                      <div>
                        <CardTitle className="text-xl text-white">{testimonial.author}</CardTitle>
                        <p className="text-sm text-white/80 uppercase tracking-wide font-medium">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  currentSlide === index ? "bg-accent" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
