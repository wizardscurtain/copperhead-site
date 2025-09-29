import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Effective Date: September 29, 2025</p>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Information We Collect</h2>
              <p className="mb-4 text-gray-300">
                Copperhead Consulting Inc ("we," "our," or "us") collects information you provide directly to us, 
                such as when you contact us for services, request a consultation, or communicate with us.
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li>Contact information (name, email address, phone number)</li>
                <li>Service inquiry details and requirements</li>
                <li>Business or personal information relevant to security consulting</li>
                <li>Communications between you and our team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Your Information</h2>
              <p className="mb-4 text-gray-300">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li>Provide security consulting and protection services</li>
                <li>Respond to your inquiries and service requests</li>
                <li>Communicate with you about our services</li>
                <li>Improve our services and website functionality</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Information Sharing</h2>
              <p className="mb-4 text-gray-300">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect the rights, property, or safety of our company, clients, or others</li>
                <li>With trusted service providers who assist in our operations (under strict confidentiality)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
              <p className="mb-4 text-gray-300">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-white"><strong>Copperhead Consulting Inc</strong></p>
                <p className="text-gray-300">Email: contact@copperheadci.com</p>
                <p className="text-gray-300">Phone: (360) 519-9932</p>
                <p className="text-gray-300">Address: 10002 Aurora Ave N Ste 36, Seattle, WA 98133</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}