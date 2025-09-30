"use client"

import { useEffect } from "react"

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      // Monitor Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("[v0] LCP:", entry.startTime)
          }
          if (entry.entryType === "first-input") {
            const fidEntry = entry as any  // Type assertion for FID-specific properties
            console.log("[v0] FID:", fidEntry.processingStart - entry.startTime)
          }
        }
      })

      try {
        observer.observe({ entryTypes: ["largest-contentful-paint", "first-input"] })
      } catch (e) {
        // Fallback for browsers that don't support these metrics
      }

      // Monitor Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any  // Type assertion for CLS-specific properties
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value
            console.log("[v0] CLS:", clsValue)
          }
        }
      })

      try {
        clsObserver.observe({ entryTypes: ["layout-shift"] })
      } catch (e) {
        // Fallback for browsers that don't support layout-shift
      }

      return () => {
        observer.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  return null
}
