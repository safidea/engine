import React from 'react'
import { BaseInput, BaseInputProps } from './BaseInput'
import { SingleSelectInputUI } from '../SingleSelectInputUI'

export interface SingleSelectInputOption {
  label: string
  value: string
}

export class SingleSelectInput extends BaseInput {
  constructor(
    field: string,
    private readonly _ui: SingleSelectInputUI,
    private readonly _options: SingleSelectInputOption[],
    label?: string,
    private readonly _placeholder?: string
  ) {
    super('text', field, label)
  }

  get placeholder() {
    return this._placeholder
  }

  get options() {
    return this._options
  }

  get ui() {
    return this._ui
  }

  renderUI() {
    const UI = this._ui
    const field = this.field
    const label = this.label
    const options = this._options
    return function SingleSelectInputUI({ updateRecord, currentRecord }: BaseInputProps) {
      const fieldValue = currentRecord.getFieldValue(field) ?? ''

      const handleUpdateRecord = (id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        updateRecord(id, e.target.name, e.target.value)
      }

      return (
        <>
          {label && <UI.label label={label} htmlFor={field} />}
          <UI.select
            onChange={(e) => handleUpdateRecord(currentRecord.id, e)}
            name={field}
            id={field}
            value={String(fieldValue)}
          >
            {options.map((option) => (
              <UI.option key={option.value} value={option.value} label={option.label} />
            ))}
          </UI.select>
        </>
      )
    }
  }
}
