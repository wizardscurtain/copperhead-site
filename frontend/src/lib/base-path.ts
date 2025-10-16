const rawBase = import.meta.env.BASE_URL || '/'

const basePath = (() => {
  if (typeof window !== 'undefined') {
    try {
      const resolved = new URL(rawBase, window.location.href).pathname
      return normalize(resolved)
    } catch (error) {
      console.warn('Failed to resolve base path from window location', error)
    }
  }
  return normalize(rawBase)
})()

function normalize(path: string): string {
  if (!path) return '/'
  let result = path.trim()

  if (!result) return '/'

  if (result.startsWith('./')) {
    result = result.replace(/^\.\//, '/')
  }

  if (!result.startsWith('/')) {
    result = `/${result}`
  }

  result = result.replace(/\/+/g, '/')

  if (!result.endsWith('/')) {
    result = `${result}/`
  }

  return result
}

export function withBase(path: string): string {
  if (!path) return basePath

  if (/^(?:[a-z]+:|\/\/)/i.test(path) || path.startsWith('#')) {
    return path
  }

  const clean = path.replace(/^\.\//, '').replace(/^\/+/, '')
  return `${basePath}${clean}`
}

export function getBasePath(): string {
  return basePath
}

export function getRouterBasename(): string {
  if (basePath === '/') {
    return '/'
  }
  return basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
}
