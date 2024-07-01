import type { Component } from '..'
import type { Config as Button } from '../base/Button'
import type { Base } from '../base/Base'

export interface Config extends Base {
  button: Button
  header?: Component[]
  body: Component[]
  footer?: Component[]
}

export interface Modal extends Config {
  component: 'Modal'
}
