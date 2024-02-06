import type { Feature } from './Feature'

export interface App {
  name: string
  features: Feature[]
  translations?: {
    language: 'EN'
    texts: string[]
  }[]
}

export type AppSchema = App
