import type { Font } from '@domain/engine/page/component/base/base'
import type { Base } from '../base/Base'
import type { Config as IconConfig } from './Icon'

export interface Config extends Base {
  label: string
  href: string
  active?: boolean
  prefixIcon?: IconConfig
  suffixIcon?: IconConfig
  font?: Font
}

export interface Link extends Config {
  component: 'Link'
}
