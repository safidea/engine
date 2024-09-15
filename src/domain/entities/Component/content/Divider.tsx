import type { Base, BaseProps, BaseServices } from '../base'

export type Props = BaseProps

export type Config = BaseProps

export type Services = BaseServices

export class Divider implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  init = async () => {}

  render = async () => {
    const { ...defaultProps } = this._config
    const Component = this._services.client.components.Divider
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
