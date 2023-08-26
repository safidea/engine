import React from 'react'
import { BaseInput, BaseInputProps } from './BaseInput'
import { SingleSelectRecordInputUI } from '@domain/spi/ui/inputs/SingleSelectRecordInputUI'

export interface SingleSelectRecordInputOption {
  label: string
  value: string
}

export interface SingleSelectRecordInputProps extends BaseInputProps {
  options: SingleSelectRecordInputOption[]
}

export class SingleSelectRecordInput extends BaseInput {
  constructor(
    fieldName: string,
    private readonly _ui: SingleSelectRecordInputUI,
    private readonly _linkedTable: string,
    label?: string,
    private readonly _placeholder?: string,
    private readonly _linkedLabelField: string = 'id'
  ) {
    super('single_select_record', fieldName, label)
  }

  get placeholder() {
    return this._placeholder
  }

  get ui() {
    return this._ui
  }

  get linkedTable() {
    return this._linkedTable
  }

  get linkedLabelField() {
    return this._linkedLabelField
  }

  renderUI() {
    const UI = this._ui
    const field = this.field
    const label = this.label
    return function SingleSelectRecordInputUI({
      updateRecord,
      currentRecord,
      options,
    }: SingleSelectRecordInputProps) {
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
