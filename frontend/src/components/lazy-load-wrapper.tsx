"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface LazyLoadWrapperProps {
  children: React.ReactNode
  className?: string
  threshold?: number
}

export function LazyLoadWrapper({ children, className = "", threshold = 0.1 }: LazyLoadWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : <div className="min-h-[200px]" />}
    </div>
  )
}
