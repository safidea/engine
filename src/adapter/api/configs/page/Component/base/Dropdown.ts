import type { Link } from './Link'
import type { Base } from './Base'

export interface Dropdown extends Base {
  label: string
  links: Link[]
}

export interface DropdownComponent extends Dropdown {
  component: 'Dropdown'
}

export interface DropdownBlock extends DropdownComponent {
  ref: string
}

export interface DropdownBlockRef extends Partial<Dropdown> {
  component: 'Dropdown'
  blockRef: string
}
