import Image from 'next/image'
import Link from 'next/link'
import HeroSlider from '../components/hero-slider'
import Footer from '../components/footer'
import { PartnersStrip } from '@/components/partners-strip'
import { TestimonialsSection } from '@/components/testimonials'
import { ServicesGrid } from '@/components/services-grid'

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

      <PartnersStrip />
      <TestimonialsSection />
      <ServicesGrid />

      <Footer />
    </div>
  )
}
