import { partners } from '../lib/content'

export function PartnersStrip() {
  // Duplicate partners array for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners]
  
  return (
    <section aria-labelledby="partners-heading" className="py-6 bg-slate-800 border-t border-slate-700">
      <div className="base-container">
        <h2 id="partners-heading" className="sr-only">Partners & Clients</h2>
        <div className="partners-scroll-container overflow-hidden">
          <div className="partners-scroll-track flex items-center gap-8 md:gap-12">
            {duplicatedPartners.map((p, index) => (
              <div key={`${p.name}-${index}`} className="grayscale hover:grayscale-0 transition flex-shrink-0 opacity-70 hover:opacity-100">
                <img
                  src={p.src}
                  alt={p.alt || p.name}
                  width={p.width ? Math.floor(p.width * 0.4) : 56}
                  height={p.height ? Math.floor(p.height * 0.4) : 24}
                  loading="lazy"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
