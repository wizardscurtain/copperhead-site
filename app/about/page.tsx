"use client"

import { Button } from "@/components/ui/button"
import Footer from "../../components/footer"
import { TeamGrid } from "@/components/team-grid"
import { ValuesSection } from "@/components/values-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Leading security professionals with decades of combined experience
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                Copperhead Consulting Inc was founded with a mission to provide unparalleled security, intelligence, and
                risk assessment solutions. Our team consists of highly skilled senior professionals with extensive
                backgrounds in law enforcement, military operations, and private security.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                We leverage cutting-edge technology and proven methodologies to deliver comprehensive security solutions
                tailored to each client's unique needs. From executive protection to cybersecurity, our diverse range of
                services ensures complete coverage for all security concerns.
              </p>
              <p className="text-lg leading-relaxed">
                With offices in Tennessee and Washington, we serve clients across the United States, providing 24/7
                support and rapid response capabilities when you need them most.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ValuesSection />
      <TeamGrid />

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work With Us?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Contact us today to discuss your security needs and learn how we can help protect what matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => (window.location.href = "tel:+13605199932")}>
                Call (360) 519-9932
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => (window.location.href = "mailto:josh@copperheadci.com")}
              >
                Email Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Learn More About Our Mission</h2>
            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
              <video
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/67db459955ee8b93594b3fd5_67ef650a7f795f40958d6f63_CCI_EP_174%20-%20720WebShareName-transcode-fkA7heUg0sBYIPWQ7FhTdGTSIjROFL.mp4"
                title="Copperhead Consulting About Us"
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="/images/executive-protection.jpg"
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
