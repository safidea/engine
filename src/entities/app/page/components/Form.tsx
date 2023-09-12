import React from 'react'
import { BaseComponent } from './BaseComponent'
import { Input } from './Input'
import { Record } from '@entities/drivers/database/Record'
import { TableInput } from './inputs/TableInput'
import { FormUI } from '../../../spi/ui/FormUI'
import { RecordFieldValue } from '@entities/drivers/database/Record/IRecord'

export type UpdateRecord = (id: string, field: string, value: RecordFieldValue) => void
export type AddRecord = (tableName: string) => void
export type RemoveRecord = (field: string, id: string) => void

export interface FormProps {
  saveRecords: () => Promise<void>
  updateRecord: UpdateRecord
  addRecord: AddRecord
  removeRecord: RemoveRecord
  InputComponents: React.FC<{
    updateRecord: UpdateRecord
    addRecord: AddRecord
    removeRecord: RemoveRecord
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
      label?: string
      autosave?: boolean
      loadingLabel: string
      actionsOnSuccess?: {
        type: string
        path: string
      }[]
    },
    private readonly _ui: FormUI,
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

  getTablesInputs(): TableInput[] {
    const tablesInputs: TableInput[] = []
    for (const input of this.inputs) {
      if (input instanceof TableInput) {
        tablesInputs.push(input)
      }
    }
    return tablesInputs
  }

  renderUI() {
    const UI = this._ui
    const submit = this._submit
    return function FormUI({
      saveRecords,
      updateRecord,
      addRecord,
      removeRecord,
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
                  removeRecord={removeRecord}
                  currentRecord={currentRecord}
                  records={records}
                />
              </UI.input>
            ))}
          </UI.inputs>
          {submit.label && (
            <UI.submit label={isSaving === false ? submit.label : submit.loadingLabel} />
          )}
          {submit.autosave === true && isSaving === true ? (
            <UI.loading label={submit.loadingLabel} />
          ) : undefined}
          {errorMessage && <UI.errorMessage message={errorMessage} />}
        </UI.form>
      )
    }
  }
}
