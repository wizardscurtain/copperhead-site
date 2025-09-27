"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/config'

interface CTAButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  eventCategory?: string
  eventLabel?: string
}

export function CTAButton({ 
  href, 
  children, 
  variant = 'primary', 
  className = '',
  eventCategory = 'engagement',
  eventLabel = 'cta_click'
}: CTAButtonProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', eventLabel, {
        event_category: eventCategory,
        event_label: eventLabel
      })
    }
  }

  if (variant === 'primary') {
    return (
      <Link 
        href={href}
        className={`hero-primary-cta ${className}`}
        onClick={handleClick}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link 
      href={href}
      className={`inline-flex items-center px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-full font-semibold transition-all duration-300 hover:scale-105 ${className}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}

export function EmergencyCallButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'emergency_call', {
        event_category: 'conversion',
        event_label: 'hero_phone_click'
      })
    }
  }

  return (
    <Link 
      href={`tel:${siteConfig.contact.phone.primary}`}
      className="ml-4 inline-flex items-center px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-full font-semibold transition-all duration-300 hover:scale-105"
      onClick={handleClick}
    >
      🚨 Emergency: {siteConfig.contact.phone.primary}
    </Link>
  )
}
