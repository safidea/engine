import React from 'react'
import { BaseInputComponent, BaseInputComponentProps } from '../base/BaseInputComponent'
import { TextInputComponentOptions } from './TextInputComponentOptions'
import { AppDrivers } from '@entities/app/App'
import { FormConfig } from '../../FormComponent'
import { TextInputComponentUI } from './TextInputComponentUI'

export class TextInputComponent extends BaseInputComponent {
  readonly placeholder?: string

  constructor(options: TextInputComponentOptions, drivers: AppDrivers, config: FormConfig) {
    const { type, field, label, placeholder } = options
    super({ type, field, label }, drivers, config)
    this.placeholder = placeholder
  }

  async render() {
    return ({ updateRecord, currentRecord }: BaseInputComponentProps) => {
      const value = currentRecord.getFieldValue(this.field) ?? ''
      const handleUpdateRecord = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        updateRecord(currentRecord.id, e.target.name, e.target.value)
      }
      return (
        <TextInputComponentUI
          label={this.label}
          field={this.field}
          onChange={handleUpdateRecord}
          value={String(value)}
          ui={this.drivers.ui}
        />
      )
    }
  }
}
