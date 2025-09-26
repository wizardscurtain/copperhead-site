'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const slides = [
  {
    src: '/assets/67e761f4b67b3fdcfbf4f17f_CCI-Web-Home.jpg',
    alt: 'Copperhead CI Home'
  },
  {
    src: '/assets/67eec03468321ce8951ae033_CCI-Web-PI.jpg', 
    alt: 'Private Investigations'
  },
  {
    src: '/assets/67eeb007429253fac0cd7e4c_CCI-Web-SOC.jpg',
    alt: 'Security Operations Center'
  },
  {
    src: '/assets/67ec892286370cc1f20c74c0_CCI-Web-Driver.jpg',
    alt: 'Driver Services'
  },
  {
    src: '/assets/67ef33259d35c0818526ccbe_CCI-Web-Train1.jpg',
    alt: 'Training Services'
  }
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="slider-3 w-slider" data-autoplay="true" data-delay="4000">
      <div className="mask-2 w-slider-mask">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide-8 w-slide ${index === currentSlide ? 'w--current' : ''}`}
            style={{ display: index === currentSlide ? 'block' : 'none' }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width={1672}
              height={800}
              className="image"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      
      <button 
        className="left-arrow-4 w-slider-arrow-left"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <div className="w-icon-slider-left"></div>
      </button>
      
      <button
        className="right-arrow-4 w-slider-arrow-right"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <div className="w-icon-slider-right"></div>
      </button>
      
      <div className="w-slider-nav w-round">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-slider-dot ${index === currentSlide ? 'w--current' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
