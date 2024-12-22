import type { IComponent } from '..'
import type { Config as Link } from '../content/Link'
import type { Config as Title } from '../content/Title'
import type { Base } from '../base/Base'

export interface Config extends Base {
  title: Title
  links: Link[]
  children?: IComponent[]
}

export interface Sidebar extends Config {
  component: 'Sidebar'
}
