import { Props } from './props.component.type'
import { ComponentTree } from './tree.component.type'
import { ComponentPage } from './page.component.type'

export type Component = {
  name: string
  ui: ComponentTree
  html?: string
}

export type { ComponentTree, Props, ComponentPage }
