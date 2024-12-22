import type { Base, BaseProps, BaseServices } from '../base'
import type { Component } from '..'
import type { PageState } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Components: React.FC<BaseProps>[]
  columns: number
}

export type Config = BaseProps

export type Services = BaseServices

export interface Entities {
  children: Component[]
}

export class Columns implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  init = async () => {
    const { children } = this._entities
    await Promise.all(children.map((child) => child.init()))
  }

  render = async (state: PageState) => {
    const { ...defaultProps } = this._config
    const Component = this._services.client.components.Columns
    const components = await Promise.all(
      this._entities.children.map((child) => child.render(state))
    )
    return (props?: Partial<Props>) => (
      <Component
        {...{
          ...defaultProps,
          columns: components.length,
          Components: components,
          ...props,
        }}
      />
    )
  }

  validateConfig = () => {
    return []
  }
}
