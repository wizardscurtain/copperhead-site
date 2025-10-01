import { useState } from 'react'
const base = import.meta.env.BASE_URL || '/'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { QuoteModal } from './quote-modal'
import { siteConfig } from '../lib/config'

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 border-b border-white/10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                width={180}
                height={60}
                src={`${base}assets/67eb2953665127110d87b36c_CCI-Logo1-Or-White-Horizontal.png`}
                alt="Copperhead Consulting Inc"
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              About Us
            </Link>
            <Link
              to="/services"
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              Contact Us
            </Link>
          </nav>

          {/* Contact Section with Phone */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href={`tel:${siteConfig.contact.phone.primary}`}
              className="flex items-center text-sm text-white hover:text-accent transition-colors group"
            >
              <img
                src={`${base}assets/67db459955ee8b93594b40f9_phone header white.webp`}
                alt="phone"
                width={16}
                height={16}
                className="group-hover:opacity-75 transition-opacity"
              />
              <span className="ml-2 font-medium">{siteConfig.contact.phone.primary}</span>
            </a>
            <QuoteModal>
              <Button className="primary-button-with-icon button-text bg-accent hover:bg-accent/90 text-white border-0">
                Get Quote
              </Button>
            </QuoteModal>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white/20 bg-slate-900/95">
              <Link
                to="/"
                className="block w-full text-left px-3 py-2 text-white hover:text-accent nav-text"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block w-full text-left px-3 py-2 text-white hover:text-accent nav-text"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/services"
                className="block w-full text-left px-3 py-2 text-white hover:text-accent nav-text"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block w-full text-left px-3 py-2 text-white hover:text-accent nav-text"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              <div className="px-3 py-2">
                <QuoteModal>
                  <Button className="primary-button-with-icon button-text w-full bg-accent hover:bg-accent/90 text-white">
                    Get Quote
                  </Button>
                </QuoteModal>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
