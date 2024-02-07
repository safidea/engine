import type { Feature } from './Feature'

export interface App {
  name: string
  features: Feature[]
  translations?: {
    language: 'EN'
    texts: string[]
  }[]
  server?: {
    port?: number
  }
  database?: {
    url?: string
    database?: 'sqlite' | 'postgres'
  }
}

export type AppSchema = App
