import type { Component } from '..'
import type { Base } from './Base'

export interface Columns extends Base {
  children: Component[]
}

export interface ColumnsComponent extends Columns {
  component: 'Columns'
}

export interface ColumnsBlock extends ColumnsComponent {
  ref: string
}

export interface ColumnsBlockRef extends Partial<Columns> {
  component: 'Columns'
  blockRef: string
}
