import type { PageState } from '@domain/entities/Page/State'

import type { Base, BaseProps, BaseServices } from '../base'

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
  | 'textarea'

export interface Props extends BaseProps {
  name: string
  type?: Type
  placeholder?: string
  label?: string
  required?: boolean
  defaultValue?: string
}

export type Config = Props

export type Services = BaseServices

export class Input implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  get name() {
    return this._config.name
  }

  init = async () => {}

  render = async (state: PageState, renderProps?: Partial<Props>) => {
    const { ...defaultProps } = this._config
    const Component = this._services.client.components.Input
    return (props?: Partial<Props>) => (
      <Component {...{ ...defaultProps, ...renderProps, ...props }} />
    )
  }

  validateConfig = () => {
    return []
  }
}
