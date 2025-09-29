import Image from 'next/image'
import { partners } from '@/lib/content'

export function PartnersStrip() {
  return (
    <section aria-labelledby="partners-heading" className="py-6 bg-slate-800 border-t border-slate-700">
      <div className="base-container">
        <h2 id="partners-heading" className="sr-only">Partners & Clients</h2>
        <div className="flex items-center justify-center gap-4 md:gap-6 overflow-x-auto">
          {partners.map(p => (
            <div key={p.name} className="grayscale hover:grayscale-0 transition flex-shrink-0 opacity-70 hover:opacity-100">
              <Image
                src={p.src}
                alt={p.alt || p.name}
                width={p.width ? Math.floor(p.width * 0.8) : 112}
                height={p.height ? Math.floor(p.height * 0.8) : 48}
                loading="lazy"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
