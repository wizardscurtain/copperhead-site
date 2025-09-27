import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'sonner'
import { siteConfig, analyticsConfig } from '@/lib/config'
import { generateSEOTags, generateLocalBusinessSchema } from '@/lib/seo'
import { Header } from '@/components/header'

// Optimized font loading
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif']
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif']
})

// SEO Metadata
const seoData = generateSEOTags({
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    ...siteConfig.seo.keywords.primary,
    ...siteConfig.seo.keywords.local,
    'veteran owned security',
    'professional protection services',
    'corporate risk assessment',
    'security training programs'
  ],
  canonicalUrl: siteConfig.url
})

export const metadata: Metadata = {
  ...seoData,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url
  },
  category: 'Security Services',
  classification: 'Business',
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    telephone: true,
    email: true,
    address: true
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteConfig.name
  },
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' }
  ],
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/assets/67eec2d5a5a87300d777cd9f_CCI-Favicon.png', sizes: '32x32' },
      { url: '/assets/67eec2d5a5a87300d777cd9f_CCI-Favicon.png', sizes: '16x16' }
    ],
    apple: [
      { url: '/assets/67eec2fa20b324faa2f6ebb1_CCI-Webclip.png', sizes: '180x180' }
    ],
    shortcut: '/assets/67eec2d5a5a87300d777cd9f_CCI-Favicon.png'
  },
  other: {
    'msapplication-TileColor': '#ff6b35',
    'msapplication-config': '/browserconfig.xml'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' }
  ],
  colorScheme: 'dark light'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Local Business Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              ...localBusinessSchema
            })
          }}
        />
        
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": siteConfig.name,
              "url": siteConfig.url,
              "description": siteConfig.description,
              "logo": `${siteConfig.url}/assets/67eb2953665127110d87b36c_CCI-Logo1-Or-White-Horizontal.png`,
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": siteConfig.contact.phone.primary,
                "contactType": "customer service",
                "areaServed": "US",
                "availableLanguage": "English"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": siteConfig.contact.addresses.seattle.street,
                "addressLocality": siteConfig.contact.addresses.seattle.city,
                "addressRegion": siteConfig.contact.addresses.seattle.state,
                "postalCode": siteConfig.contact.addresses.seattle.zip,
                "addressCountry": "US"
              },
              "sameAs": [
                siteConfig.links.linkedin
              ]
            })
          }}
        />
      </head>
      <body 
        className="min-h-screen bg-background font-inter antialiased"
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${analyticsConfig.googleTagManager.containerId}`}
            height="0" 
            width="0" 
            style={{display:'none', visibility:'hidden'}}
            title="Google Tag Manager"
          />
        </noscript>
        
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-accent-foreground px-4 py-2 rounded-md z-50 font-medium"
        >
          Skip to main content
        </a>
        
        <Header />
        
        <main id="main-content" role="main">
          {children}
        </main>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          expand={true}
          richColors
          closeButton
          toastOptions={{
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))'
            }
          }}
        />
        
        {/* Google Tag Manager */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${analyticsConfig.googleTagManager.containerId}');
            `
          }}
        />
        
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalytics.measurementId}`}
          strategy="afterInteractive"
        />
        <Script
          id="ga4"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsConfig.googleAnalytics.measurementId}', {
                page_title: document.title,
                page_location: window.location.href,
                send_page_view: true,
                anonymize_ip: true,
                allow_google_signals: true,
                allow_ad_personalization_signals: false
              });
            `
          }}
        />
        
        {/* Performance monitoring for Core Web Vitals */}
        <Script
          id="web-vitals"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function sendToGoogleAnalytics({name, delta, value, id}) {
                gtag('event', name, {
                  event_category: 'Web Vitals',
                  event_label: id,
                  value: Math.round(name === 'CLS' ? delta * 1000 : delta),
                  non_interaction: true,
                });
              }
              
              if ('web-vitals' in window) {
                import('web-vitals').then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
                  getCLS(sendToGoogleAnalytics);
                  getFID(sendToGoogleAnalytics);
                  getFCP(sendToGoogleAnalytics);
                  getLCP(sendToGoogleAnalytics);
                  getTTFB(sendToGoogleAnalytics);
                });
              }
            `
          }}
        />
        
        {/* Structured Data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": siteConfig.name,
              "url": siteConfig.url,
              "description": siteConfig.description,
              "publisher": {
                "@type": "Organization",
                "name": siteConfig.name
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${siteConfig.url}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  )
}
