import type { Breakpoint } from '@domain/engine/page/component/base/base'
import type { Component } from '..'
import type { Base } from '../base/Base'

export interface Config extends Base {
  children: Component[]
  center?: boolean
  breakpoint?: Breakpoint
  padding?:
    | string
    | { DEFAULT?: string; sm?: string; md?: string; lg?: string; xl?: string; '2xl'?: string }
}

export interface Container extends Config {
  component: 'Container'
}
