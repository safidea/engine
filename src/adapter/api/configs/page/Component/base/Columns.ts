import type { Component } from '..'
import type { Base } from './Base'

export interface Config extends Base {
  children: Component[]
}

export interface Columns extends Config {
  component: 'Columns'
}
