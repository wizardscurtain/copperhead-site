import Image from 'next/image'
import Link from 'next/link'
import HeroSlider from '../components/hero-slider'
import Footer from '../components/footer'

export default function HomePage() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="section-home-hero">
        <div className="home-hero-container">
          <div className="home-hero-left">
            <div className="home-hero-content">
              <h1 className="home-hero-heading">
                COPPERHEAD<br />
                CONSULTING<br />
                <span className="orange-text">INC.</span>
              </h1>
              <div className="home-hero-text">
                Veteran Owned and operated executive and personal protection, security consulting, 
                private investigations and training. Pacific Northwest Washington State and Oregon.
              </div>
              <div className="button-hero-wrapper">
                <Link href="#video" className="primary-button-with-icon w-inline-block">
                  <p className="button-white-text">Watch</p>
                  <div className="icons-wrapper">
                    <Image
                      src="/assets/67db459955ee8b93594b40fd_Play.webp"
                      alt="Play icon"
                      width={20}
                      height={20}
                      className="link-icon-white"
                    />
                    <Image
                      src="/assets/67ed9c3f382e7903ed6c91bc_mdi_play.svg"
                      alt="Play icon"
                      width={20}
                      height={20}
                      className="link-icon-red"
                    />
                  </div>
                  <div className="white-btn-ov"></div>
                </Link>
              </div>
            </div>
          </div>
          <div className="home-hero-right">
            <HeroSlider />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="section">
        <div className="base-container">
          <div className="customer-reviews-slider">
            <div className="testimonials-slide">
              <div className="customer-reviews-container">
                <div className="customer-reviews-left">
                  <div className="white-left-preloader"></div>
                </div>
                <div className="customer-reviews-right">
                  <p className="testimonials-main-title">Testimonials</p>
                  <div className="reviews-text">
                    Rapid deployment in a high demand market, proper backgrounds, solid agents...High Tier delivery 
                    to new and existing clients on first delivery...Looking forward to continued service.
                  </div>
                  <div className="name-container">
                    <h5 className="autor-name">Pinkerton, Associate Director of Operations Seattle</h5>
                    <div className="star-icon-wrapper">
                      {[...Array(5)].map((_, i) => (
                        <Image
                          key={i}
                          src="/assets/67db459955ee8b93594b4101_Star%201.webp"
                          alt="Star"
                          width={16}
                          height={16}
                          className="star-icon"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section">
        <div className="base-container">
          <div className="services-content">
            <h2 className="section-heading">Our Services</h2>
            <div className="services-grid">
              <div className="service-item">
                <div className="service-icon-wrapper">
                  <Image
                    src="/assets/67db459955ee8b93594b4101_Guard.webp"
                    alt="Security Services"
                    width={60}
                    height={60}
                  />
                </div>
                <h3>Executive Protection</h3>
                <p>Professional executive and VIP protection services</p>
              </div>
              
              <div className="service-item">
                <div className="service-icon-wrapper">
                  <Image
                    src="/assets/67db459955ee8b93594b4101_Investigation.webp"
                    alt="Private Investigations"
                    width={60}
                    height={60}
                  />
                </div>
                <h3>Private Investigations</h3>
                <p>Comprehensive investigative services</p>
              </div>
              
              <div className="service-item">
                <div className="service-icon-wrapper">
                  <Image
                    src="/assets/67db459955ee8b93594b4101_Training.webp"
                    alt="Training"
                    width={60}
                    height={60}
                  />
                </div>
                <h3>Training</h3>
                <p>Professional security training programs</p>
              </div>
              
              <div className="service-item">
                <div className="service-icon-wrapper">
                  <Image
                    src="/assets/67db459955ee8b93594b4101_Consulting.webp"
                    alt="Consulting"
                    width={60}
                    height={60}
                  />
                </div>
                <h3>Security Consulting</h3>
                <p>Expert security consultation services</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
