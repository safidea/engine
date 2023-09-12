import { BaseUIProps } from './BaseUI'

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
