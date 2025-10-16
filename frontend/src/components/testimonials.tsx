import { testimonials } from '../lib/content'

const base = import.meta.env.BASE_URL || '/'

export function TestimonialsSection() {
  if (!testimonials.length) return null
  return (
    <section className="section bg-slate-900 text-white" aria-labelledby="testimonials-heading">
      <div className="base-container">
        <h2 id="testimonials-heading" className="testimonials-main-title text-white">Testimonials</h2>
        <div className="space-y-8">
          {testimonials.map((t, idx) => (
            <figure key={idx} className="bg-slate-800/50 rounded-xl p-8 shadow-md border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
              <blockquote className="reviews-text">
                <p className="text-gray-100">“{t.quote}”</p>
              </blockquote>
              <figcaption className="mt-4 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="autor-name text-white font-medium">{t.role ? `${t.role}` : t.author}</p>
                  <p className="text-sm text-gray-300">{t.author !== t.role ? t.author : ''}</p>
                </div>
                {t.rating && (
                  <div className="star-icon-wrapper" aria-label={`${t.rating} star rating`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <img
                        key={i}
                        src={`${base}assets/67db459955ee8b93594b4101_Star%201.webp`}
                        alt="Star"
                        width={20}
                        height={20}
                        loading="lazy"
                        decoding="async"
                      />
                    ))}
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
