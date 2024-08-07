import type { Config as Title } from '../content/Title'
import type { Config as Button } from '../base/Button'
import type { Config as Link } from '../content/Link'
import type { Config as Dropdown } from '../base/Dropdown'
import type { Base } from '../base/Base'

export interface Config extends Base {
  title: Title
  links: (Link | Dropdown)[]
  buttons: Button[]
}

export interface Header extends Config {
  component: 'Header'
}
