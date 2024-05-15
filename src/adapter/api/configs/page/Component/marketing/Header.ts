import type { Title } from '../base/Title'
import type { Button } from '../base/Button'
import type { Link } from '../base/Link'
import type { Base } from '../base/Base'

export interface Header extends Base {
  title: Title
  links: Link[]
  buttons: Button[]
}

export interface HeaderComponent extends Header {
  component: 'Header'
}

export interface HeaderBlock extends HeaderComponent {
  ref: string
}

export interface HeaderBlockRef extends Partial<Header> {
  component: 'Header'
  blockRef: string
}
