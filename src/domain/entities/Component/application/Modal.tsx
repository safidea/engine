import type { Base, BaseProps, BaseServices } from '../base'
import type { Component } from '..'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { Button, Props as ButtonProps } from '../base/Button'
import type { State } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Button: React.FC<Partial<ButtonProps>>
  header?: React.ReactNode
  body: React.ReactNode
  footer?: React.ReactNode
}

export type Config = BaseProps

export type Services = BaseServices

export interface Entities {
  button: Button
  header?: Component[]
  body: Component[]
  footer?: Component[]
}

export class Modal implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  init = async () => {
    const { button, header = [], body, footer = [] } = this._entities
    await Promise.all([
      button.init(),
      ...header.map((child) => child.init()),
      ...body.map((child) => child.init()),
      ...footer.map((child) => child.init()),
    ])
  }

  render = async (state: State) => {
    const { button, header: headerParam, body: bodyParam, footer: footerParam } = this._entities
    const { id, className } = this._config
    const { client } = this._services
    const Button = await button.render(state)
    const header = headerParam
      ? await Promise.all(headerParam.map((child) => child.render(state)))
      : undefined
    const body = await Promise.all(bodyParam.map((child) => child.render(state)))
    const footer = footerParam
      ? await Promise.all(footerParam.map((child) => child.render(state)))
      : undefined
    const Component = client.components.Modal
    return (props?: Partial<Props>) => (
      <Component
        {...{
          id,
          className,
          Button,
          header: header?.map((Child, index) => <Child key={index} />),
          body: body.map((Child, index) => <Child key={index} />),
          footer: footer?.map((Child, index) => <Child key={index} />),
          ...props,
        }}
      />
    )
  }

  validateConfig = () => {
    const { button, header = [], body, footer = [] } = this._entities
    const errors: ConfigError[] = []
    errors.push(...button.validateConfig())
    header.forEach((child) => {
      errors.push(...child.validateConfig())
    })
    body.forEach((child) => {
      errors.push(...child.validateConfig())
    })
    footer.forEach((child) => {
      errors.push(...child.validateConfig())
    })
    return errors
  }
}
