import React from 'react'
import { BaseInputComponent, BaseInputComponentProps } from '../base/BaseInputComponent'
import { AppDrivers } from '@entities/app/App'
import { SingleSelectInputComponentOptions } from './SingleSelectInputComponentOptions'
import { SingleSelectInputComponentUI } from './SingleSelectInputComponentUI'
import { FormConfig } from '../../FormComponent'

export class SingleSelectInputComponent extends BaseInputComponent {
  readonly placeholder?: string
  readonly options: SingleSelectInputComponentOptions['options'] = []

  constructor(options: SingleSelectInputComponentOptions, drivers: AppDrivers, config: FormConfig) {
    const { type, field, label, placeholder, options: selectOptions } = options
    super({ type, field, label }, drivers, config)
    this.placeholder = placeholder
    this.options = selectOptions
  }

  render() {
    return ({ updateRecord, currentRecord }: BaseInputComponentProps) => {
      const value = currentRecord.getFieldValue(this.field) ?? ''
      const handleUpdateRecord = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        updateRecord(currentRecord.id, e.target.name, e.target.value)
      }
      return (
        <SingleSelectInputComponentUI
          label={this.label}
          field={this.field}
          value={String(value)}
          options={this.options}
          onChange={handleUpdateRecord}
          ui={this.drivers.ui}
        />
      )
    }
  }
}
