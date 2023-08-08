import React from 'react'
import { BaseInput, BaseInputProps } from './BaseInput'
import { TextInputUI } from '../../ui/inputs/TextInputUI'

export class TextInput extends BaseInput {
  constructor(
    field: string,
    private readonly _ui: TextInputUI,
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
    return function TextInputUI({ updateRecord, currentRecord }: BaseInputProps) {
      const fieldValue = currentRecord.getFieldValue(field) ?? ''

      const handleUpdateRecord = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        updateRecord(id, e.target.name, e.target.value)
      }

      return (
        <>
          {label && <UI.label label={label} htmlFor={field} />}
          <UI.input
            onChange={(e) => handleUpdateRecord(currentRecord.id, e)}
            name={field}
            id={field}
            value={String(fieldValue)}
          />
        </>
      )
    }
  }
}
