import type { IComponent } from '..'
import type { Config as Button } from '../base/Button'
import type { Base } from '../base/Base'

export interface Config extends Base {
  button: Button
  header?: IComponent[]
  body: IComponent[]
  footer?: IComponent[]
}

export interface Modal extends Config {
  component: 'Modal'
}
