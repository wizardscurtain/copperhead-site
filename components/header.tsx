"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { QuoteModal } from "@/components/quote-modal"
import Link from "next/link"

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

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false) // Close mobile menu after clicking
  }

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-accent/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img
                src="/images/cci-logo-horizontal.png"
                alt="Copperhead Consulting Inc"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("services")}
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              Services
            </button>
            <Link
              href="/services"
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              All Services
            </Link>
            <Link
              href="/about"
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              About
            </Link>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              Contact
            </button>
          </nav>

          {/* Contact Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:(360)519-9932"
              className="flex items-center text-sm text-white hover:text-accent transition-colors"
            >
              <PhoneIcon />
              <span className="ml-2 font-medium">(360) 519-9932</span>
            </a>
            <QuoteModal>
              <Button className="primary-button-with-icon button-text bg-accent hover:bg-accent/90 text-white border-0">
                Get Quote
              </Button>
            </QuoteModal>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-accent/20 bg-black/95">
              <button
                onClick={() => scrollToSection("services")}
                className="block w-full text-left px-3 py-2 text-white hover:text-accent nav-text"
              >
                Services
              </button>
              <Link
                href="/services"
                className="block w-full text-left px-3 py-2 text-white hover:text-accent nav-text"
                onClick={() => setIsMenuOpen(false)}
              >
                All Services
              </Link>
              <Link
                href="/about"
                className="block w-full text-left px-3 py-2 text-white hover:text-accent nav-text"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="block w-full text-left px-3 py-2 text-white hover:text-accent nav-text"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-3 py-2 text-white hover:text-accent nav-text"
              >
                Contact
              </button>
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
