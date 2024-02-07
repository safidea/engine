import type { Component } from './component'
import type { Head } from './head'

export interface Page {
  name: string
  path: string
  head?: Head
  body: Component[]
}

export type PageSchema = Page
