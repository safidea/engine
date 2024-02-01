import type { Base, BaseComponent, HTMLInputType } from '../base'

export interface FormConfig {
  title: string
  description: string
  inputs: {
    name: string
    type?: HTMLInputType
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
  component: BaseComponent<FormConfig>
}

export class Form implements Base {
  constructor(
    private config: FormConfig,
    private params: FormParams
  ) {}

  render = () => <this.params.component {...this.config} />
}
