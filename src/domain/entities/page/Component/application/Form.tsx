import type { Base, ReactComponent, InputType } from '../base'

export interface Props {
  title: string
  description: string
  action?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
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

  render = () => {
    const {
      component: Component,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      props: { successMessage, ...props },
    } = this.params
    return <Component {...props} />
  }
}
