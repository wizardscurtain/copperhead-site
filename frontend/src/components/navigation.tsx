import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

  return (
    <nav className="nav-fixed-white-menu w-nav" role="banner">
      <div className="main-nav-container w-container">
        <div className="main-menu-wrapper">
          <Image
            src="/assets/67eb2953665127110d87b36c_CCI-Logo1-Or-White-Horizontal.png"
            alt="Copperhead Consulting Inc Logo"
            width={221}
            height={60}
            className="image-3"
          />
          <Link href="/" className="brand-logo w-nav-brand" aria-current="page"></Link>
          
          <nav role="navigation" className={`nav-menu-wrap w-nav-menu ${isMenuOpen ? 'w--open' : ''}`}>
            <div className="nav-menu-shadow-overlay-3">
              <div className="tablet-menu-3">
                <button 
                  className="close-menu-button-2 w-nav-button"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Image
                    src="/assets/63c155ba2b5c7835ff19d720_x_icon.webp"
                    alt="Close menu"
                    width={20}
                    height={20}
                    className="nav-close-icon-3"
                  />
                </button>
              </div>
              
              <div className="dropdown-menu-2">
                <div className="top-tablet-menu-2">
                  <Link href="/" className="logo-mobile-3 w-nav-brand">
                    <Image
                      src="/assets/67f1de0b3fcfae53e58db532_CCI-OB-Logo.png"
                      alt="CCI Logo"
                      width={200}
                      height={60}
                      className="image-main-logo-tablet"
                    />
                  </Link>
                  
                  <div className="border-wrap-2">
                    {[
                      { href: '/', label: 'Home' },
                      { href: '/about', label: 'About Us' },
                      { href: '/services', label: 'Services' },
                      { href: '/contact', label: 'Contact Us' },
                    ].map(link => {
                      const active = pathname === link.href
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`nav-item-link ${active ? 'active-nav-link' : ''}`}
                          aria-current={active ? 'page' : undefined}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
                
                <div className="login-tablet-wrap">
                  <div className="phone-tablet-wrap">
                    <Image
                      src="/assets/67ed39fc12566ee1705f9642_ion_call-outline.svg"
                      alt="Phone"
                      width={20}
                      height={20}
                      className="address-icon-red-tablet"
                    />
                    <div className="phone-tablet-container">
                      <a href="tel:(360)519-9932" className="link-black red-hover">
                        (360) 519-9932
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="right-header-wrap">
            <div className="phone-header-wrap">
              <div className="address-icon-wrapper">
                <Image
                  src="/assets/67db459955ee8b93594b40f9_phone%20header%20white.webp"
                  alt="Phone"
                  width={20}
                  height={20}
                  className="address-icon"
                />
                <Image
                  src="/assets/67db459955ee8b93594b40fb_phone%20red.webp"
                  alt="Phone"
                  width={20}
                  height={20}
                  className="address-icon-red"
                />
              </div>
              <div className="phone-container">
                <a href="tel:(360)286-1782" className="header-contact-link">
                  (360) 286-1782
                </a>
              </div>
            </div>
          </div>
          
          <button 
            className="menu-button-3 w-nav-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="wrapper-item-home-2">
              <div className="nav-line-wrapper">
                <div className="nav-line-item"></div>
                <div className="nav-line-item"></div>
                <div className="nav-line-item"></div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </nav>
  )
}
