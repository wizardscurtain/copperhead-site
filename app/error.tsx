'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Route error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center">
          <Image
            src="/assets/67eb2953665127110d87b36c_CCI-Logo1-Or-White-Horizontal.png"
            alt="Copperhead Consulting Inc"
            width={240}
            height={80}
            className="mx-auto mb-8 h-16 w-auto"
          />
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Page Error
          </h1>
          <p className="text-muted-foreground mb-8">
            This page encountered an error. Please try refreshing or return to the homepage.
          </p>
          <div className="space-y-4">
            <Button
              onClick={reset}
              className="w-full"
              variant="default"
            >
              Try again
            </Button>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Return home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}