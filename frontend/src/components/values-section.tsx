import { valueProps } from '../lib/content'

const iconMap: Record<string, JSX.Element> = {
  excellence: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  integrity: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
  ),
  innovation: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  ),
}

export function ValuesSection() {
  if (!valueProps.length) return null
  return (
    <section className="py-20 bg-slate-900" aria-labelledby="values-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h2 id="values-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueProps.map(v => (
            <div key={v.title} className="text-center p-6 rounded-xl bg-slate-800/50 backdrop-blur shadow-lg border border-slate-700/50">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-accent/20 text-accent">
                {iconMap[v.icon || 'excellence']}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{v.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
