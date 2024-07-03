import type { Base } from '../base/Base'

export interface Config extends Base {
  content: string
}

export interface Markdown extends Config {
  component: 'Markdown'
}
