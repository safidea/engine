import type { Component as OtherComponent } from '..'
import type { Link } from '../base/Link'
import type { Title } from '../base/Title'

export interface Sidebar {
  title: Title
  links: Link[]
  children?: OtherComponent[]
}

export interface SidebarComponent extends Sidebar {
  component: 'Sidebar'
}

export interface SidebarBlock extends SidebarComponent {
  ref: string
}

export interface SidebarBlockRef extends Partial<Sidebar> {
  component: 'Sidebar'
  blockRef: string
}
