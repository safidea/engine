import type { IComponent } from '..'
import type { Base } from '../base/Base'

export interface Config extends Base {
  children: IComponent[]
  columns: number
}

export interface Grid extends Config {
  component: 'Grid'
}
