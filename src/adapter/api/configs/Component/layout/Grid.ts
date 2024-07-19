import type { Component } from '..'
import type { Base } from '../base/Base'

export interface Config extends Base {
  children: Component[]
  columns: number
}

export interface Grid extends Config {
  component: 'Grid'
}
