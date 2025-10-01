// Minimal ambient declarations for GitHub Pages build environment without installing @types/node
declare module 'path' {
  export function resolve(...paths: string[]): string
  export function dirname(p: string): string
}
declare module 'url' {
  export function fileURLToPath(path: string): string
}
declare const __dirname: string
declare const process: { env: Record<string, string | undefined> }