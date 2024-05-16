import type { Link } from './Link'
import type { Base } from './Base'

export interface Menu extends Base {
  label: string
  links: Link[]
}

export interface MenuComponent extends Menu {
  component: 'Menu'
}

export interface MenuBlock extends MenuComponent {
  ref: string
}

export interface MenuBlockRef extends Partial<Menu> {
  component: 'Menu'
  blockRef: string
}
