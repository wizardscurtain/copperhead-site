import { ServicesGrid } from '../components/services-grid'
import { CTAButton } from '../components/cta-buttons'
import { usePageSEO } from '../hooks/usePageSEO'
import { JsonLd } from '../components/JsonLd'
import { buildBreadcrumbList, getBreadcrumbs } from '../lib/breadcrumbs'
import { aeoContent } from '../lib/seo'
import { coreServices, generateServiceSchema } from '../lib/service-schema'

export default function ServicesPage() {
  usePageSEO(
    'Professional Security Services',
    'Comprehensive security solutions backed by decades of experience and cutting-edge technology',
    '/services'
  )

  const breadcrumbs = buildBreadcrumbList(getBreadcrumbs('/services'))
  const howTo = aeoContent.howToContent.chooseSecurityConsultant
  
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step
    }))
  }

  const serviceSchemas = coreServices.map(service => generateServiceSchema(service))

  return (
    <div className="bg-slate-900 min-h-screen">
      <JsonLd data={breadcrumbs} />
      <JsonLd data={howToSchema} />
      {serviceSchemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-slate-800 py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li className="before:content-['/'] before:mx-2">Services</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Professional Security Services
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive security solutions backed by decades of experience and cutting-edge technology
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesGrid />
          
          <div className="text-center mt-16">
            <CTAButton 
              href="/contact"
              className="bg-accent hover:bg-accent/90 text-white font-semibold py-4 px-12 rounded-lg transition-all duration-300 text-lg"
            >
              Request Consultation
            </CTAButton>
          </div>
        </div>
      </section>

      {/* How-To Section */}
      <section className="py-20 bg-slate-800" aria-labelledby="howto-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 id="howto-heading" className="text-3xl font-bold text-white mb-8 text-center">
            {howTo.name}
          </h2>
          <ol className="space-y-4 mt-8">
            {howTo.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold">
                  {index + 1}
                </span>
                <p className="text-gray-300 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Additional Service Information */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Why Choose Copperhead Consulting?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Proven Experience</h3>
                <p className="text-gray-300">Over 20 years of combined security experience with government and corporate clients.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Elite Training</h3>
                <p className="text-gray-300">Superior training with medical and life-saving techniques providing 3:1 capability vs standard guards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}