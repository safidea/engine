import type { Props } from '@domain/engine/page/component/application/Sidebar'
import type { Component } from '..'

export interface Sidebar extends Omit<Props, 'children'> {
  component: 'Sidebar'
  children: Component[]
}
