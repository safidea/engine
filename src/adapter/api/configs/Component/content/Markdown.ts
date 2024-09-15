import type { Font } from '@domain/entities/Component/base'
import type { Base } from '../base/Base'

export interface Config extends Base {
  content: string
  font?: Font
}

export interface Markdown extends Config {
  component: 'Markdown'
}
