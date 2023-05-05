import type { ObjectInterface } from 'foundation-common'
import type { ComponentInterface } from '@component'

export interface PageInterface extends ObjectInterface {
  head?: {
    title?: string
    description?: string
    image?: string
    favicon?: string
    keywords?: string
    author?: string
    twitter?: string
    robots?: string
  }
  body: ComponentInterface
}

export interface PagesInterface extends ObjectInterface {
  [key: string]: PageInterface
}
