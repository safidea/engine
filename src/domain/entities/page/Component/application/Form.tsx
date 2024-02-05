import type { Base, ReactComponent, InputType } from '../base'

export interface Props {
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

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Form implements Base {
  constructor(private params: Params) {}

  render = () => <this.params.component {...this.params.props} />
}
