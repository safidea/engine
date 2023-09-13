import React from 'react'
import { RecordFieldValue } from '@entities/drivers/database/Record/IRecord'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { Record } from '@entities/drivers/database/Record'
import { IUISpi } from '../../../../drivers/ui/IUISpi'

export type UpdateRecord = (id: string, field: string, value: RecordFieldValue) => void
export type AddRecord = (tableName: string) => void
export type RemoveRecord = (field: string, id: string) => void
export interface FormComponentUIProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  saveRecords: () => Promise<void>
  updateRecord: UpdateRecord
  addRecord: AddRecord
  removeRecord: RemoveRecord
  InputsComponents: React.FC<{
    updateRecord: UpdateRecord
    addRecord: AddRecord
    removeRecord: RemoveRecord
    records: Record[]
    currentRecord: Record
  }>[]
  submit: {
    label?: string
    loadingLabel: string
    autosave?: boolean
  }
  isSaving: boolean
  errorMessage?: string
  records: Record[]
  currentRecord: Record
  ui: IUISpi
}

export function FormComponentUI({
  onSubmit,
  InputsComponents,
  updateRecord,
  addRecord,
  removeRecord,
  currentRecord,
  records,
  submit,
  isSaving,
  errorMessage,
  ui,
}: FormComponentUIProps) {
  const { Form, Inputs, Submit, ErrorMessage, Loading } = ui.FormUI
  return (
    <Form onSubmit={onSubmit}>
      <Inputs>
        {InputsComponents.map((InputComponent, index) => (
          <InputComponent
            key={index}
            updateRecord={updateRecord}
            addRecord={addRecord}
            removeRecord={removeRecord}
            currentRecord={currentRecord}
            records={records}
          />
        ))}
      </Inputs>
      {submit.label && <Submit label={isSaving === false ? submit.label : submit.loadingLabel} />}
      {submit.autosave === true && isSaving === true ? (
        <Loading label={submit.loadingLabel} />
      ) : undefined}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </Form>
  )
}

export interface FormUIFormProps extends BaseComponentUIProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export interface FormUISubmitProps {
  label: string
}

export interface FormUILoadingProps {
  label: string
}

export interface FormUIErrorMessageProps {
  message: string
}

export interface FormUI {
  Form: React.FC<FormUIFormProps>
  Inputs: React.FC<BaseComponentUIProps>
  Submit: React.FC<FormUISubmitProps>
  ErrorMessage: React.FC<FormUIErrorMessageProps>
  Loading: React.FC<FormUILoadingProps>
}
