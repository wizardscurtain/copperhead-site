"use client"

import { useEffect, useState, useRef } from "react"

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0])
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    { number: 152, suffix: "%", label: "Year Increase" },
    { number: 15, suffix: "", label: "Trusted Vendors" },
    { number: 50, suffix: "+", label: "Trained Agents" },
    { number: 20, suffix: "+", label: "Years Experience" },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Animate numbers
          stats.forEach((stat, index) => {
            let current = 0
            const increment = stat.number / 50
            const timer = setInterval(() => {
              current += increment
              if (current >= stat.number) {
                current = stat.number
                clearInterval(timer)
              }
              setAnimatedStats((prev) => {
                const newStats = [...prev]
                newStats[index] = Math.floor(current)
                return newStats
              })
            }, 30)
          })
        }
      },
      { threshold: 0.5 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">
                {animatedStats[index]}
                {stat.suffix}
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
