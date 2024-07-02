import type { Base } from './Base'

export interface Config extends Base {
  content: string
}

export interface Markdown extends Config {
  component: 'Markdown'
}
