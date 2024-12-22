import type { IComponent } from '..'
import type { Base } from '../base/Base'

export interface Config extends Base {
  children: IComponent[]
}

export interface Columns extends Config {
  component: 'Columns'
}
