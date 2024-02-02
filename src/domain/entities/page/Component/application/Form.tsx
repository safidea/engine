import type { Base, ReactComponent, InputType } from '../base'

export interface FormConfig {
  title: string
  description: string
  inputs: {
    name: string
    type?: InputType
    placeholder?: string
    label?: string
    required?: boolean
  }[]
  submitButton: {
    label: string
  }
  successMessage?: string
}

export type FormProps = FormConfig

export interface FormParams {
  component: ReactComponent<FormConfig>
}

export class Form implements Base {
  constructor(
    private config: FormConfig,
    private params: FormParams
  ) {}

  render = () => <this.params.component {...this.config} />
}
