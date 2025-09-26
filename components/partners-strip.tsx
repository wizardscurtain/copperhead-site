import Image from 'next/image'
import { partners } from '@/lib/content'

export function PartnersStrip() {
  return (
    <section aria-labelledby="partners-heading" className="py-12 bg-white border-t border-gray-200">
      <div className="base-container">
        <h2 id="partners-heading" className="sr-only">Partners & Clients</h2>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map(p => (
            <div key={p.name} className="grayscale hover:grayscale-0 transition w-auto opacity-70 hover:opacity-100">
              <Image
                src={p.src}
                alt={p.alt || p.name}
                width={p.width || 140}
                height={p.height || 60}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
