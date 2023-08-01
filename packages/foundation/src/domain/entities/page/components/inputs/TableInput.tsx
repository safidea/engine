import React from 'react'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { BaseInput } from './BaseInput'
import { HandleChange } from '../Form'

export type Column = {
  label: string
  field?: string
  placeholder?: string
}

export interface TableInputProps {
  handleChange: HandleChange
}

export class TableInput extends BaseInput {
  constructor(
    field: string,
    private readonly _columns: Column[],
    private readonly _ui: IUIGateway['TableInputUI'],
    label?: string,
    private readonly _addLabel?: string
  ) {
    super('text', field, label)
  }

  get columns() {
    return this._columns
  }

  get addLabel() {
    return this._addLabel
  }

  renderUI() {
    const UI = this._ui
    const field = this.field
    return function Component({ handleChange }: TableInputProps) {
      return <UI handleChange={handleChange} name={field} />
    }
  }
}
