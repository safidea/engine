import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { Record } from '@entities/services/database/record/Record'
import { RecordFieldValue } from '@entities/services/database/record/RecordData'
import { BaseComponentProps } from '../base/BaseComponentProps'

export type UpdateRecord = (id: string, field: string, value: RecordFieldValue) => void
export type AddRecord = (tableName: string) => void
export type RemoveRecord = (field: string, id: string) => void

export interface FormInputComponentProps {
  updateRecord?: UpdateRecord
  addRecord?: AddRecord
  removeRecord?: RemoveRecord
  currentRecord?: Record
  records?: Record[]
}
export interface FormComponentProps extends BaseComponentProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  saveRecords: () => Promise<void>
  updateRecord: UpdateRecord
  addRecord: AddRecord
  removeRecord: RemoveRecord
  Components: React.FC<FormInputComponentProps>[]
  submit: {
    label?: string
    loadingLabel: string
    autosave?: boolean
  }
  isSaving: boolean
  errorMessage?: string
  records: Record[]
  currentRecord: Record
}

export function FormComponentUI({
  onSubmit,
  Components,
  updateRecord,
  addRecord,
  removeRecord,
  currentRecord,
  records,
  submit,
  isSaving,
  errorMessage,
  ui,
  testId,
}: FormComponentProps) {
  const { Form, Submit, ErrorMessage, Loading } = ui.getForm()
  return (
    <Form onSubmit={onSubmit} testId={testId}>
      <>
        {Components.map((Component, index) => (
          <Component
            key={index}
            updateRecord={updateRecord}
            addRecord={addRecord}
            removeRecord={removeRecord}
            currentRecord={currentRecord}
            records={records}
          />
        ))}
      </>
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
  Submit: React.FC<FormUISubmitProps>
  ErrorMessage: React.FC<FormUIErrorMessageProps>
  Loading: React.FC<FormUILoadingProps>
}
