"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { QuoteModal } from "@/components/quote-modal"
import Link from "next/link"
import { siteConfig } from '@/lib/config'

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
              <Image
                width={180}
                height={60}
                src="/assets/67eb2953665127110d87b36c_CCI-Logo1-Or-White-Horizontal.png"
                alt="Copperhead Consulting Inc"
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              About Us
            </Link>
            <Link
              href="/services"
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="nav-text text-white hover:text-accent transition-colors uppercase tracking-wide"
            >
              Contact Us
            </Link>
          </nav>

          {/* Contact Section with Proper Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href={`tel:${siteConfig.contact.phone.primary}`}
              className="flex items-center text-sm text-white hover:text-accent transition-colors group"
            >
              <Image
                src="/assets/67db459955ee8b93594b40f9_phone header white.webp"
                alt="phone"
                width={16}
                height={16}
                className="group-hover:opacity-75 transition-opacity"
              />
              <span className="ml-2 font-medium">{siteConfig.contact.phone.primary}</span>
            </a>
            <a
              href={`mailto:${Buffer.from(siteConfig.contact.emailObfuscated, 'base64').toString()}`}
              className="flex items-center text-sm text-white hover:text-accent transition-colors group"
            >
              <Image
                src="/assets/67ed3b656b6d6f57852373cd_tabler_mail.svg"
                alt="email"
                width={16}
                height={16}
                className="group-hover:opacity-75 transition-opacity"
              />
              <span className="ml-2 font-medium">Contact Us</span>
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
