import React from 'react'
import { UI } from '@adapter/spi/ui/UI'
import { BaseComponent } from './BaseComponent'
import { Input } from './Input'
import { Record, RecordFieldValue } from '@domain/entities/app/Record'

export type UpdateRecord = (id: string, field: string, value: RecordFieldValue) => void
export type AddRecord = (tableName: string) => void

export interface FormProps {
  saveRecords: () => Promise<void>
  updateRecord: UpdateRecord
  addRecord: AddRecord
  InputComponents: React.FC<{
    updateRecord: UpdateRecord
    addRecord: AddRecord
    records: Record[]
    currentRecord: Record
  }>[]
  isSaving: boolean
  errorMessage?: string
  records: Record[]
  currentRecord: Record
}

export class Form extends BaseComponent {
  constructor(
    private readonly _tableName: string,
    private readonly _inputs: Input[],
    private readonly _submit: {
      label: string
      loadingLabel: string
      actionsOnSuccess?: {
        type: string
        path: string
      }[]
    },
    private readonly _ui: UI['FormUI'],
    private readonly _recordIdToUpdate?: string
  ) {
    super('title')
  }

  get tableName() {
    return this._tableName
  }

  get inputs() {
    return this._inputs
  }

  get submit() {
    return this._submit
  }

  get ui() {
    return this._ui
  }

  get recordIdToUpdate() {
    return this._recordIdToUpdate
  }

  renderUI() {
    const UI = this._ui
    const submit = this._submit
    return function FormUI({
      saveRecords,
      updateRecord,
      addRecord,
      InputComponents,
      isSaving,
      errorMessage,
      records,
      currentRecord,
    }: FormProps) {
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await saveRecords()
      }
      return (
        <UI.form onSubmit={handleSubmit}>
          <UI.inputs>
            {InputComponents.map((InputComponent, index) => (
              <UI.input key={index}>
                <InputComponent
                  updateRecord={updateRecord}
                  addRecord={addRecord}
                  currentRecord={currentRecord}
                  records={records}
                />
              </UI.input>
            ))}
          </UI.inputs>
          <UI.submit label={isSaving === false ? submit.label : submit.loadingLabel} />
          {errorMessage && <UI.errorMessage message={errorMessage} />}
        </UI.form>
      )
    }
  }
}
