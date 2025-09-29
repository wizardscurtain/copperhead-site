// Centralized configuration for CopperheadCI website
// Production-ready configuration management

export const siteConfig = {
  name: "Copperhead Consulting Inc",
  description: "Veteran-owned security consulting, executive protection, private investigations, and training services serving the Pacific Northwest.",
  url: "https://copperheadci.com",
  ogImage: "https://copperheadci.com/og-image.jpg",
  links: {
    linkedin: "https://linkedin.com/company/copperhead-consulting-inc",
  },
  contact: {
    phone: {
      primary: "(360) 519-9932",
      secondary: "(360) 286-1782"
    },
    // Obfuscated email - decoded client-side
    emailObfuscated: "am9zaEBjb3BwZXJoZWFkY2kuY29t", // base64 of josh@copperheadci.com
    addresses: {
      tennessee: {
        street: "20 West Main St, Suite 3",
        city: "Hohenwald",
        state: "TN",
        zip: "38462"
      },
      seattle: {
        street: "10002 Aurora Ave N Ste 36, PMB 432",
        city: "Seattle",
        state: "WA",
        zip: "98133"
      }
    }
  },
  businessHours: {
    weekdays: "8:00 AM - 6:00 PM",
    saturday: "9:00 AM - 4:00 PM",
    sunday: "Emergency Services Only",
    emergency: "24/7 Emergency Response Available"
  },
  services: {
    primary: [
      "Executive Protection",
      "Security Consulting", 
      "Private Investigations",
      "Risk Assessment",
      "Training Services",
      "K9 Detection"
    ],
    areas: [
      "Seattle, WA",
      "Pacific Northwest",
      "Washington State",
      "Oregon"
    ]
  },
  seo: {
    keywords: {
      primary: [
        "security consulting Seattle",
        "executive protection Washington", 
        "private investigation services",
        "risk assessment consulting",
        "corporate security solutions"
      ],
      local: [
        "Seattle security consultants",
        "Washington executive protection",
        "Pacific Northwest security services",
        "Seattle private investigators"
      ]
    },
    location: {
      city: "Seattle",
      state: "Washington", 
      region: "Pacific Northwest",
      coordinates: {
        latitude: 47.6062,
        longitude: -122.3321
      }
    }
  }
}

// Brand configuration
export const brandConfig = {
  colors: {
    primary: "#ff6b35", // CopperheadCI Orange
    secondary: "#1a1a1a",
    accent: "#f26522",
    text: {
      light: "#ffffff",
      dark: "#333333",
      muted: "#666666"
    }
  },
  fonts: {
    primary: "Inter",
    secondary: "Poppins",
    mono: "Inconsolata"
  }
}

// Analytics configuration
export const analyticsConfig = {
  googleAnalytics: {
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"
  },
  googleTagManager: {
    containerId: import.meta.env.VITE_GTM_ID || "GTM-XXXXXXX"
  }
}

// Performance configuration
export const performanceConfig = {
  images: {
    domains: ['copperheadci.com', 'vercel.com'],
    formats: ['webp', 'avif'],
    quality: 85
  },
  caching: {
    staticAssets: '31536000', // 1 year
    pages: '86400', // 1 day
    api: '3600' // 1 hour
  }
}
