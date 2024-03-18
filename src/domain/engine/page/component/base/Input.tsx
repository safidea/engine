import type { State } from '../../State'
import type { ReactComponent, Base, BaseProps } from './base'

export type Type =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'

export interface Props extends BaseProps {
  name: string
  type?: Type
  placeholder?: string
  label?: string
  required?: boolean
  defaultValue?: string
}

interface Params extends Props {
  Component: ReactComponent<Props>
}

export class Input implements Base<Props> {
  constructor(private params: Params) {}

  get name() {
    return this.params.name
  }

  init = async () => {}

  render = async (state: State, renderProps?: Partial<Props>) => {
    const { Component, ...defaultProps } = this.params
    return (props?: Partial<Props>) => (
      <Component {...{ ...defaultProps, ...renderProps, ...props }} />
    )
  }

  validateConfig = () => {
    return []
  }
}
