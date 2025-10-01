/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_GA_MEASUREMENT_ID: string
  readonly VITE_GTM_ID: string
  readonly VITE_GOOGLE_VERIFICATION: string
  readonly VITE_BING_VERIFICATION: string
  // Vite always injects BASE_URL, add it so TypeScript stops complaining when accessed
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
