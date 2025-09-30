import { Link } from 'react-router-dom'

interface CTAButtonProps {
  href: string
  className?: string
  children: React.ReactNode
  eventLabel?: string
}

export function CTAButton({ href, className = "", children, eventLabel }: CTAButtonProps) {
  // Handle external links vs internal routing
  const isExternal = href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')
  
  if (isExternal) {
    return (
      <a href={href} className={className} data-event-label={eventLabel}>
        {children}
      </a>
    )
  }
  
  return (
    <Link to={href} className={className} data-event-label={eventLabel}>
      {children}
    </Link>
  )
}

interface EmergencyCallButtonProps {
  eventLabel?: string
}

export function EmergencyCallButton({ eventLabel }: EmergencyCallButtonProps) {
  return (
    <a
      href="tel:(360) 519-9932"
      className="ml-4 inline-flex items-center px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-full font-semibold transition-all duration-300 hover:scale-105"
      data-event-label={eventLabel}
    >
      🚨 Emergency: (360) 519-9932
    </a>
  )
}