import type { ComponentWithBlock } from './component'
import type { Head } from './head'

export interface Page {
  name: string
  path: string
  head?: Head
  body: ComponentWithBlock[]
}

export type PageSchema = Page
