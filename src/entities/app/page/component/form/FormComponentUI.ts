import { BaseUIProps } from '../base/BaseUI'

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

export interface FormUIFormProps extends BaseUIProps {
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
  form: React.FC<FormUIFormProps>
  input: React.FC<BaseUIProps>
  inputs: React.FC<BaseUIProps>
  submit: React.FC<FormUISubmitProps>
  errorMessage: React.FC<FormUIErrorMessageProps>
  loading: React.FC<FormUILoadingProps>
}
