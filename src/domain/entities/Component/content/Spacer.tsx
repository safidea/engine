import type { Base, BaseProps, Size, BaseServices } from '../base'

export interface Props extends BaseProps {
  size?: Size
}

export type Config = Props

export type Services = BaseServices

export class Spacer implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  init = async () => {}

  render = async () => {
    const { ...defaultProps } = this._config
    const Component = this._services.client.components.Spacer
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
