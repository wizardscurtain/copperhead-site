import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Comprehensive security solutions tailored to your specific needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Executive Protection */}
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Executive Protection</h3>
              <p className="text-muted-foreground mb-6">
                Professional close protection services for high-profile individuals and executives.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>

            {/* K9 Detection */}
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">K9 Detection</h3>
              <p className="text-muted-foreground mb-6">
                Specialized canine units for explosive, narcotic, and contraband detection.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>

            {/* Surveillance */}
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Surveillance</h3>
              <p className="text-muted-foreground mb-6">
                Advanced surveillance operations using cutting-edge technology and techniques.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>

            {/* Cybersecurity */}
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Cybersecurity</h3>
              <p className="text-muted-foreground mb-6">
                Comprehensive digital security solutions and threat assessment services.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>

            {/* Private Investigation */}
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Private Investigation</h3>
              <p className="text-muted-foreground mb-6">
                Professional investigative services for corporate and personal matters.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>

            {/* Risk Assessment */}
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Risk Assessment</h3>
              <p className="text-muted-foreground mb-6">
                Comprehensive security assessments and vulnerability analysis.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">See Our Services in Action</h2>
            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
              <video
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/67db459955ee8b93594b3fd5_67ef650a7f795f40958d6f63_CCI_EP_174%20-%20720WebShareName-transcode-fkA7heUg0sBYIPWQ7FhTdGTSIjROFL.mp4"
                title="Copperhead Consulting Services"
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="/images/training-session.jpg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
