import type { Base } from './Base'
import type { Config as IconConfig } from './Icon'

export interface Config extends Base {
  label: string
  href: string
  active?: boolean
  prefixIcon?: IconConfig
  suffixIcon?: IconConfig
}

export interface Link extends Config {
  component: 'Link'
}
