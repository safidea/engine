import type { Component } from '..'
import type { Link } from '../base/Link'
import type { Title } from '../base/Title'
import type { Base } from '../base/Base'

export interface Sidebar extends Base {
  title: Title
  links: Link[]
  children?: Component[]
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
