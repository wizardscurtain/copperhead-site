import Image from 'next/image'
import { team } from '@/lib/content'

export function TeamGrid() {
  if (!team.length) return null
  return (
    <section className="py-20 bg-white" aria-labelledby="team-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h2 id="team-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">Leadership Team</h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {team.map(m => (
            <div key={m.name} className="group relative rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-gray-50">
              {m.img && (
                <Image src={m.img} alt={m.name} width={400} height={420} className="h-56 w-full object-cover" />
              )}
              <div className="p-5">
                <h3 className="font-semibold text-lg">{m.name}</h3>
                <p className="text-sm text-accent font-medium mb-2">{m.role}</p>
                {m.bio && <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{m.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
