import type { Config as Link } from './Link'
import type { Base } from './Base'

export interface Config extends Base {
  label: string
  links: Link[]
}

export interface Dropdown extends Config {
  component: 'Dropdown'
}
