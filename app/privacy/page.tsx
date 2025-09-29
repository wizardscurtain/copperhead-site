import { Metadata } from 'next'
import Footer from '@/components/footer'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Privacy Policy | Copperhead Consulting Inc',
  description: 'Privacy Policy for Copperhead Consulting Inc - Professional Security Services',
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Effective Date: September 29, 2025</p>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-4">
                  Copperhead Consulting Inc ("we," "our," or "us") collects information you provide directly to us, 
                  such as when you contact us for services, request a consultation, or communicate with us.
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Contact information (name, email address, phone number)</li>
                  <li>Service inquiry details and requirements</li>
                  <li>Business or personal information relevant to security consulting</li>
                  <li>Communications between you and our team</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide security consulting and protection services</li>
                  <li>Respond to your inquiries and service requests</li>
                  <li>Communicate with you about our services</li>
                  <li>Improve our services and website functionality</li>
                  <li>Comply with legal obligations and protect our rights</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                <p className="mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations or court orders</li>
                  <li>To protect the rights, property, or safety of our company, clients, or others</li>
                  <li>With trusted service providers who assist in our operations (under strict confidentiality)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p className="mb-4">
                  As a security consulting firm, we take data protection seriously. We implement appropriate 
                  technical and organizational measures to protect your personal information against unauthorized 
                  access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data (subject to legal obligations)</li>
                  <li>Withdraw consent for data processing</li>
                  <li>File a complaint with relevant data protection authorities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Copperhead Consulting Inc</strong></p>
                  <p>Email: josh@copperheadci.com</p>
                  <p>Phone: (360) 519-9932</p>
                  <p>Address: 10002 Aurora Ave N Ste 36, Seattle, WA 98133</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any significant 
                  changes by posting the updated policy on our website with a new effective date.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}