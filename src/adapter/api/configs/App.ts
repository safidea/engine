import type { Feature } from './Feature'

export interface App {
  name: string
  features: Feature[]
}

export type AppSchema = App