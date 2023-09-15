import React from 'react'
import { BaseInputComponent, BaseInputComponentProps } from '../base/BaseInputComponent'
import { TextInputComponentParams } from './TextInputComponentParams'
import { AppServices } from '@entities/app/App'
import { FormConfig } from '../../FormComponent'
import { TextInputComponentUI } from './TextInputComponentUI'

export class TextInputComponent extends BaseInputComponent {
  readonly placeholder?: string

  constructor(params: TextInputComponentParams, services: AppServices, config: FormConfig) {
    const { type, field, label, placeholder } = params
    super({ type, field, label }, services, config)
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
          ui={this.services.ui}
        />
      )
    }
  }
}
