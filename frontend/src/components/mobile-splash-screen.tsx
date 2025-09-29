import { useState, useEffect } from 'react'
import { Button } from './ui/button'

interface MobileSplashScreenProps {
  onProceed: () => void
}

export function MobileSplashScreen({ onProceed }: MobileSplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if this is a mobile device and if splash should be shown
    const isMobile = window.innerWidth <= 768
    const hasSeenSplash = localStorage.getItem('copperhead-splash-seen')
    
    if (isMobile && !hasSeenSplash) {
      setIsVisible(true)
    } else {
      onProceed()
    }
  }, [onProceed])

  const handleContactNow = () => {
    const subject = encodeURIComponent('Immediate Response Requested')
    const email = 'contact@copperheadci.com'
    const mailtoUrl = `mailto:${email}?subject=${subject}`
    
    // Open default email client
    window.location.href = mailtoUrl
    
    // Mark splash as seen and proceed to app
    localStorage.setItem('copperhead-splash-seen', 'true')
    setIsVisible(false)
    onProceed()
  }

  const handleProceedToApp = () => {
    localStorage.setItem('copperhead-splash-seen', 'true')
    setIsVisible(false)
    onProceed()
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6">
      {/* Copperhead Logo */}
      <div className="mb-8">
        <img
          src="/assets/67eb2953665127110d87b36c_CCI-Logo1-Or-White-Horizontal.png"
          alt="Copperhead Consulting Inc"
          width={280}
          height={100}
          className="h-20 w-auto"
          loading="eager"
        />
      </div>

      {/* Main Question */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-white mb-4">
          Do you need immediate service?
        </h1>
        <p className="text-gray-300 text-lg">
          Get instant access to our security experts
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-4">
        {/* Contact Us Now - Left/Top Button */}
        <Button
          onClick={handleContactNow}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-all duration-300"
          size="lg"
        >
          🚨 Contact Us Now
        </Button>

        {/* Proceed to App - Right/Bottom Button */}
        <Button
          onClick={handleProceedToApp}
          variant="outline"
          className="w-full border-accent text-accent hover:bg-accent hover:text-white font-semibold py-4 px-6 rounded-lg text-lg transition-all duration-300"
          size="lg"
        >
          Proceed to App
        </Button>
      </div>

      {/* Small disclaimer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-gray-400 text-sm">
          Elite Security • Professional Protection • 24/7 Support
        </p>
      </div>
    </div>
  )
}