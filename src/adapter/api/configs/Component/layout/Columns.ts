import type { Component } from '..'
import type { Base } from '../base/Base'

export interface Config extends Base {
  children: Component[]
}

export interface Columns extends Config {
  component: 'Columns'
}
