import { ContactForm } from '../components/contact-form'

export default function ContactPage() {
  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to discuss your security needs? Get in touch with our team of professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 text-accent mt-1">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Seattle Office</h3>
                      <p className="text-gray-300">10002 Aurora Ave N Ste 36<br/>Seattle, WA 98133</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 text-accent mt-1">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Phone</h3>
                      <p className="text-gray-300">
                        <a href="tel:(360) 519-9932" className="hover:text-accent transition-colors">
                          (360) 519-9932
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 text-accent mt-1">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email</h3>
                      <p className="text-gray-300">
                        <a href="mailto:contact@copperheadci.com" className="hover:text-accent transition-colors">
                          contact@copperheadci.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="h-64 rounded-lg overflow-hidden bg-slate-800">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2679.8334!2d-122.3426!3d47.7036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5490135d1a00b5b3%3A0x20b8e4ac6b5e3f8!2s10002%20Aurora%20Ave%20N%20Ste%2036%2C%20Seattle%2C%20WA%2098133!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Copperhead Consulting Inc - Seattle Office Location"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}