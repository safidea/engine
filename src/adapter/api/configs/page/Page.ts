import type { Component } from './Component'
import type { Head } from './Head'

export interface Page {
  name: string
  path: string
  head?: Head
  body: Component[]
}

export type PageSchema = Page
