import type { Metadata } from "next"
import { Inconsolata, Lato, Poppins, Inter } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { PerformanceMonitor } from "@/components/performance-monitor"
import Navigation from "@/components/navigation"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type React from "react"

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inconsolata",
  display: "swap",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Copperhead Consulting Inc - Elite Security Solutions | Executive Protection & Risk Assessment",
  description:
    "Copperhead Consulting delivers exceptional security, intelligence, and risk assessment solutions using cutting-edge technology and skilled senior professionals. Serving government agencies and global corporations.",
  keywords:
    "security consulting, executive protection, risk assessment, private investigations, K9 detection, surveillance, robotics, TSCM, threat assessment, security operations center",
  authors: [{ name: "Copperhead Consulting Inc" }],
  creator: "Copperhead Consulting Inc",
  publisher: "Copperhead Consulting Inc",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://copperheadci.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Copperhead Consulting Inc - Elite Security Solutions",
    description:
      "Exceptional security, intelligence, and risk assessment solutions using cutting-edge technology and skilled senior professionals.",
    url: "https://copperheadci.com",
    siteName: "Copperhead Consulting Inc",
    images: [
      {
        url: "/assets/67e761f4b67b3fdcfbf4f17f_CCI-Web-Home.jpg",
        width: 1200,
        height: 630,
        alt: "Copperhead Consulting - Elite Security Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Copperhead Consulting Inc - Elite Security Solutions",
    description:
      "Exceptional security, intelligence, and risk assessment solutions using cutting-edge technology and skilled senior professionals.",
  images: ["/assets/67e761f4b67b3fdcfbf4f17f_CCI-Web-Home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  other: {
    "theme-color": "#1e40af",
    "msapplication-TileColor": "#1e40af",
    "ai:company": "Copperhead Consulting Inc",
    "ai:industry": "Security Consulting",
    "ai:services":
      "Executive Protection, Private Investigations, K9 Detection, Risk Assessment, Security Operations, Surveillance, Robotics",
    "ai:location": "Seattle, WA, USA",
    "ai:phone": "(360) 519-9932",
    "ai:experience": "20+ years",
    "ai:agents": "50+ trained agents",
    "ai:certifications": "ISO 27001 Certified, Licensed & Bonded",
    "ai:availability": "24/7 Response",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
    generator: 'v0.app'
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://copperheadci.com/#organization",
      name: "Copperhead Consulting Inc",
      alternateName: "Copperhead CI",
      url: "https://copperheadci.com",
      logo: {
        "@type": "ImageObject",
        url: "https://copperheadci.com/logo.png",
        width: 300,
        height: 100,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-360-519-9932",
        contactType: "customer service",
        availableLanguage: "English",
        areaServed: "US",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "10002 Aurora Ave N Ste 36, PMB 432",
        addressLocality: "Seattle",
        addressRegion: "WA",
        postalCode: "98133",
        addressCountry: "US",
      },
      sameAs: ["https://www.linkedin.com/company/copperhead-consulting", "https://twitter.com/copperheadci"],
      foundingDate: "2004",
      numberOfEmployees: "50+",
      slogan: "We value your safety",
      description:
        "Elite security consulting firm delivering exceptional security, intelligence, and risk assessment solutions using cutting-edge technology and skilled senior professionals.",
      serviceArea: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 47.6062,
          longitude: -122.3321,
        },
        geoRadius: "50000",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://copperheadci.com/#website",
      url: "https://copperheadci.com",
      name: "Copperhead Consulting Inc",
      description: "Elite security solutions and risk assessment services",
      publisher: {
        "@id": "https://copperheadci.com/#organization",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "Service",
      name: "Executive Protection",
      provider: {
        "@id": "https://copperheadci.com/#organization",
      },
      description: "Elite, discreet protection for executives and high-profile clients",
      serviceType: "Security Service",
    },
    {
      "@type": "Service",
      name: "Private Investigations",
      provider: {
        "@id": "https://copperheadci.com/#organization",
      },
      description: "Confidential, thorough investigations tailored to your needs",
      serviceType: "Investigation Service",
    },
    {
      "@type": "Service",
      name: "K9 Detection",
      provider: {
        "@id": "https://copperheadci.com/#organization",
      },
      description: "Internationally certified teams specializing in firearms, explosives and narcotics detection",
      serviceType: "Security Service",
    },
    {
      "@type": "Service",
      name: "Threat/Risk Assessments",
      provider: {
        "@id": "https://copperheadci.com/#organization",
      },
      description: "Proactive threat and risk assessments to safeguard your assets and operations",
      serviceType: "Risk Assessment",
    },
    {
      "@type": "Service",
      name: "Security Operations Center",
      provider: {
        "@id": "https://copperheadci.com/#organization",
      },
      description: "24/7 Security Operations Center delivers real-time monitoring and rapid response",
      serviceType: "Security Monitoring",
    },
    {
      "@type": "Service",
      name: "Surveillance & Robotics",
      provider: {
        "@id": "https://copperheadci.com/#organization",
      },
      description: "Advanced surveillance robots and drones provide autonomous, real-time security coverage",
      serviceType: "Surveillance Service",
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`font-lato ${inconsolata.variable} ${lato.variable} ${poppins.variable} ${inter.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

  <Navigation />
  <Suspense fallback={<div className="min-h-screen bg-background" />}>{children}</Suspense>
  <PerformanceMonitor />
  <Analytics />
  <SpeedInsights />

        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Custom lightweight analytics
            if (typeof window !== 'undefined' && !window.__GA_INIT) {
              window.__GA_INIT = true;
              const id = process.env.NEXT_PUBLIC_GA_ID || 'GA_MEASUREMENT_ID';
              if (id && id !== 'GA_MEASUREMENT_ID') {
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', id);
              }
            }
          `,
          }}
        />
      </body>
    </html>
  )
}
