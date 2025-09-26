import Image from 'next/image'
import { services } from '@/lib/content'

export function ServicesGrid() {
  return (
    <section className="services-section" aria-labelledby="services-heading">
      <div className="base-container">
        <h2 id="services-heading" className="section-heading">Our Services</h2>
        <div className="services-grid">
          {services.map(s => (
            <div key={s.title} className="service-item" role="listitem">
              <div className="service-icon-wrapper">
                <Image src={s.icon} alt={s.title} width={60} height={60} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
