'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { heroSlides, type SlideItem } from '../lib/content'

interface HeroSliderProps {
  slides?: SlideItem[]
  intervalMs?: number
  autoPlay?: boolean
}

export default function HeroSlider({ slides = heroSlides, intervalMs = 4000, autoPlay = true }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const total = slides.length

  const next = useCallback(() => setCurrent((p) => (p + 1) % total), [total])
  const prev = useCallback(() => setCurrent((p) => (p - 1 + total) % total), [total])
  const go = (i: number) => setCurrent(i)

  useEffect(() => {
    if (!autoPlay) return
    const id = setInterval(next, intervalMs)
    return () => clearInterval(id)
  }, [next, intervalMs, autoPlay])

  return (
    <div className="slider-3 w-slider" data-autoplay={autoPlay} data-delay={intervalMs} aria-roledescription="carousel">
      <div className="mask-2 w-slider-mask">
        {slides.map((slide, i) => (
          <div
            key={slide.src + i}
            className={`slide-8 w-slide ${i === current ? 'w--current' : ''}`}
            style={{ display: i === current ? 'block' : 'none' }}
            role="group"
            aria-label={`${i + 1} of ${total}`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width={1672}
              height={800}
              className="image"
              priority={i === 0 || slide.priority}
            />
          </div>
        ))}
      </div>
      <button
        className="left-arrow-4 w-slider-arrow-left"
        onClick={prev}
        aria-label="Previous slide"
      >
        <div className="w-icon-slider-left" />
      </button>
      <button
        className="right-arrow-4 w-slider-arrow-right"
        onClick={next}
        aria-label="Next slide"
      >
        <div className="w-icon-slider-right" />
      </button>
      <div className="w-slider-nav w-round" role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-slider-dot ${i === current ? 'w--current' : ''}`}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === current}
            role="tab"
          />
        ))}
      </div>
    </div>
  )
}

