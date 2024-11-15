import type { Base, BaseProps, BaseServices } from '../base'
import type { Component } from '..'
import type { PageState } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Components: React.FC<BaseProps>[]
  columns: number
}

export interface Config extends BaseProps {
  columns: number
}

export type Services = BaseServices

export interface Entities {
  children: Component[]
}

export class Grid implements Base<Props> {
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
    const components = await Promise.all(
      this._entities.children.map((child) => child.render(state))
    )
    const Component = this._services.client.components.Grid
    return (props?: Partial<Props>) => (
      <Component
        {...{
          ...defaultProps,
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
