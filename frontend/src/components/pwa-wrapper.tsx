'use client'

import { useState, useEffect } from 'react'
import { MobileSplashScreen } from './mobile-splash-screen'

interface PWAWrapperProps {
  children: React.ReactNode
}

export function PWAWrapper({ children }: PWAWrapperProps) {
  const [showSplash, setShowSplash] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    // Check if we should show splash screen
    const isMobile = window.innerWidth <= 768
    const hasSeenSplash = localStorage.getItem('copperhead-splash-seen')
    
    if (!isMobile || hasSeenSplash) {
      setShowSplash(false)
    }
    
    setIsLoading(false)
  }, [])

  const handleProceedFromSplash = () => {
    setShowSplash(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showSplash ? (
        <MobileSplashScreen onProceed={handleProceedFromSplash} />
      ) : (
        children
      )}
    </>
  )
}