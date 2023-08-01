import React from 'react'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { BaseInput } from './BaseInput'
import { HandleChange } from '../Form'

export interface TextInputProps {
  handleChange: HandleChange
}

export class TextInput extends BaseInput {
  constructor(
    field: string,
    private readonly _ui: IUIGateway['TextInputUI'],
    label?: string,
    private readonly _placeholder?: string
  ) {
    super('text', field, label)
  }

  get placeholder() {
    return this._placeholder
  }

  get ui() {
    return this._ui
  }

  renderUI() {
    const UI = this._ui
    const field = this.field
    return function Component({ handleChange }: TextInputProps) {
      return <UI onChange={(e) => handleChange(e.target.name, e.target.value)} name={field} />
    }
  }
}
