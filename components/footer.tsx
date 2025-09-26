import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Image
              src="/assets/67eb2953665127110d87b36c_CCI-Logo1-Or-White-Horizontal.png"
              alt="Copperhead Consulting Inc"
              width={200}
              height={50}
              className="mb-4"
            />
            <p className="text-gray-300 mb-4">
              Veteran Owned and operated executive and personal protection, 
              security consulting, private investigations and training.
            </p>
            <p className="text-gray-400">
              Pacific Northwest Washington State and Oregon
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="tel:(360)519-9932" className="hover:text-white transition-colors">
                  (360) 519-9932
                </a>
              </li>
              <li>
                <a href="tel:(360)286-1782" className="hover:text-white transition-colors">
                  (360) 286-1782
                </a>
              </li>
              <li>
                <a href="mailto:soc@copperheadci.com" className="hover:text-white transition-colors">
                  soc@copperheadci.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Copperhead Consulting Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
