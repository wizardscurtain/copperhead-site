import { ContactForm } from "@/components/contact-form"
import Footer from "../../components/footer"
import dynamic from 'next/dynamic'

// Google Maps embed for the Seattle office
const Map = dynamic(() => Promise.resolve(() => (
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2679.8334!2d-122.3426!3d47.7036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5490135d1a00b5b3%3A0x20b8e4ac6b5e3f8!2s10002%20Aurora%20Ave%20N%20Ste%2036%2C%20Seattle%2C%20WA%2098133!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus"
    width="100%"
    height="100%"
    style={{border: 0}}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Copperhead Consulting Inc - Seattle Office Location"
    className="w-full h-full"
  />
)), { ssr: false })

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with our security experts to discuss your needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="space-y-8 lg:col-span-1">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">(360) 519-9932</p>
                      <p className="font-medium">(360) 286-1782</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="font-medium">josh@copperheadci.com</p>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-accent mr-3 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">20 West Main St, Suite 3</p>
                      <p className="text-muted-foreground">Hohenwald, TN 38462</p>
                      <p className="font-medium mt-2">10002 Aurora Ave N Ste 36, PMB 432</p>
                      <p className="text-muted-foreground">Seattle, WA 98133</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 4:00 PM</p>
                  <p>Sunday: Emergency Services Only</p>
                  <p className="text-accent font-medium">24/7 Emergency Response Available</p>
                </div>
              </div>
            </div>

            {/* Contact Form + Map */}
            <div className="space-y-8 lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <ContactForm
                    type="contact"
                    title="Send Us a Message"
                    description="Fill out the form below and we'll get back to you within 24 hours."
                  />
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <Map />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
