import type { Base, BaseProps, Align, Size, Font, BaseServices } from '../base'

export interface Props extends BaseProps {
  text?: string
  children?: React.ReactNode
  align?: Align
  size?: Size
  font?: Font
}

export type Config = BaseProps

export type Services = BaseServices

export class Paragraph implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  init = async () => {}

  render = async () => {
    const { ...defaultProps } = this._config
    const Component = this._services.client.components.Paragraph
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
