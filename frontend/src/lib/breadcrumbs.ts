import { siteConfig } from './config'

export interface BreadcrumbItem {
  name: string
  url: string
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const baseUrl = siteConfig.url
  const items: BreadcrumbItem[] = [
    { name: 'Home', url: baseUrl + '/' }
  ]

  const path = pathname.replace(/^\//, '').replace(/\/$/, '')
  if (!path) return items

  const segments = path.split('/')
  let currentPath = ''

  segments.forEach(segment => {
    currentPath += '/' + segment
    const name = segment.charAt(0).toUpperCase() + segment.slice(1)
    items.push({
      name,
      url: baseUrl + currentPath
    })
  })

  return items
}
