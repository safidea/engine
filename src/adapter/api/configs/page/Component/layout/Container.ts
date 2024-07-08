import type { Component } from '..'
import type { Base } from '../base/Base'

export interface Config extends Base {
  children: Component[]
  center?: boolean
  breakpoint?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  padding?:
    | string
    | { DEFAULT?: string; sm?: string; md?: string; lg?: string; xl?: string; '2xl'?: string }
}

export interface Container extends Config {
  component: 'Container'
}
