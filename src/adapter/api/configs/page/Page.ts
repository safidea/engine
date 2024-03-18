import type { ComponentWithBlockRef } from './Component'
import type { Head } from './Head'

export interface Page {
  name: string
  path: string
  head?: Head
  body: ComponentWithBlockRef[]
}

export type PageSchema = Page
