import type { Font } from '@domain/engine/page/component/base/base'
import type { Base } from '../base/Base'

export interface Config extends Base {
  content: string
  font?: Font
}

export interface Markdown extends Config {
  component: 'Markdown'
}
