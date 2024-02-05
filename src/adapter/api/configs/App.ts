import type { Feature } from './Feature'
import type { Role } from './Role'

export interface App {
  name: string
  features: Feature[]
  roles?: Role[]
}

export type AppSchema = App