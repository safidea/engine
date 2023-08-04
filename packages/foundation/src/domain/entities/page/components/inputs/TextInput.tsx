import React from 'react'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { BaseInput } from './BaseInput'
import { FormInputValue, HandleChange } from '../Form'

export interface TextInputProps {
  handleChange: HandleChange
  formData: { [key: string]: FormInputValue }
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
    const label = this.label
    return function TextInputUI({ handleChange, formData }: TextInputProps) {
      const fieldValue = formData[field] !== undefined ? String(formData[field]) : ''
      return (
        <>
          {label && <UI.label label={label} htmlFor={field} />}
          <UI.input
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            name={field}
            id={field}
            value={fieldValue}
          />
        </>
      )
    }
  }
}
