import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { withBase } from '../lib/base-path'

interface HeroSlide {
  id: string
  image: string
  alt: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 'home',
    image: withBase('assets/67e761f4b67b3fdcfbf4f17f_CCI-Web-Home.jpg'),
    alt: 'Copperhead CI Professional Security Services'
  },
  {
    id: 'pi',
    image: withBase('assets/67eec03468321ce8951ae033_CCI-Web-PI.jpg'),
    alt: 'Private Investigations Services'
  },
  {
    id: 'soc',
    image: withBase('assets/67eeb007429253fac0cd7e4c_CCI-Web-SOC.jpg'),
    alt: 'Security Operations Center'
  },
  {
    id: 'driver',
    image: withBase('assets/67ec892286370cc1f20c74c0_CCI-Web-Driver.jpg'),
    alt: 'Executive Protection Driving Services'
  },
  {
    id: 'training',
    image: withBase('assets/67ef33259d35c0818526ccbe_CCI-Web-Train1.jpg'),
    alt: 'Professional Security Training'
  }
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // 5 seconds per slide

    return () => clearInterval(interval)
  }, [isPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="hero-carousel-container">
      {/* Hero Images */}
      <div className="hero-background">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="object-cover w-full h-full absolute inset-0"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        <div className="hero-overlay" />
      </div>

      {/* Carousel Controls */}
      <div className="hero-carousel-controls">
        {/* Previous/Next Buttons */}
        <button
          onClick={prevSlide}
          className="hero-nav-button prev"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="hero-nav-button next"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
              onMouseEnter={() => setIsPlaying(false)}
              onMouseLeave={() => setIsPlaying(true)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
