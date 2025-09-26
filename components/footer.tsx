import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
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
          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="https://www.linkedin.com/company/copperhead-consulting-inc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <Image src="/assets/67efea24e374e193de17a675_mdi_linkedin.svg" alt="LinkedIn" width={20} height={20} />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.75 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/></svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2h3.308l-7.227 8.26L23 22h-6.422l-4.973-6.617L5.812 22H2.5l7.73-8.835L2 2h6.578l4.49 5.935L18.244 2Zm-1.164 17.94h1.833L7.05 3.94H5.095l12 16Z"/></svg>
                  X / Twitter
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
