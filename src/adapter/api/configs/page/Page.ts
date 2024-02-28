import type { ComponentWithBlockRef } from './component'
import type { Head } from './head'

export interface Page {
  name: string
  path: string
  head?: Head
  body: ComponentWithBlockRef[]
}

export type PageSchema = Page
