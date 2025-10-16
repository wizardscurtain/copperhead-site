import { useEffect } from 'react'
import { siteConfig } from '../lib/config'

export function usePageSEO(title: string, description: string, path?: string) {
  useEffect(() => {
    const fullTitle = title.includes(siteConfig.name) 
      ? title 
      : `${title} | ${siteConfig.name}`
    
    document.title = fullTitle
    
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = siteConfig.url + (path || window.location.pathname)
    
    let metaDesc = document.querySelector("meta[name='description']") as HTMLMetaElement | null
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = description
    
    let ogTitle = document.querySelector("meta[property='og:title']") as HTMLMetaElement | null
    if (ogTitle) ogTitle.content = fullTitle
    
    let ogDesc = document.querySelector("meta[property='og:description']") as HTMLMetaElement | null
    if (ogDesc) ogDesc.content = description
    
    let twitterTitle = document.querySelector("meta[name='twitter:title']") as HTMLMetaElement | null
    if (twitterTitle) twitterTitle.content = fullTitle
    
    let twitterDesc = document.querySelector("meta[name='twitter:description']") as HTMLMetaElement | null
    if (twitterDesc) twitterDesc.content = description
  }, [title, description, path])
}
