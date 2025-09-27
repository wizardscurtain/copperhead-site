import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
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
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-4">
            <Link href="/" className="block">
              <Button className="w-full" variant="default">
                Return home
              </Button>
            </Link>
            <Link href="/services" className="block">
              <Button variant="outline" className="w-full">
                View services
              </Button>
            </Link>
            <Link href="/contact" className="block">
              <Button variant="ghost" className="w-full">
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}