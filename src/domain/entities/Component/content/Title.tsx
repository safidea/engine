import type { Base, BaseProps, Align, Size, Font, BaseServices } from '../base'

export interface Props extends BaseProps {
  text: string
  size?: Size
  align?: Align
  heading?: number
  font?: Font
}

export type Config = Props

export type Services = BaseServices

export class Title implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  init = async () => {}

  render = async () => {
    const { ...defaultProps } = this._config
    const { client } = this._services
    const Component = client.components.Title
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
