import type { Base, BaseProps, Size, RoundedSize, Align, BaseServices } from '../base'

export interface Props extends BaseProps {
  src: string
  alt: string
  size?: Size
  rounded?: RoundedSize
  align?: Align
}

export type Config = Props

export type Services = BaseServices

export class Image implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  init = async () => {}

  render = async () => {
    const { ...defaultProps } = this._config
    const Component = this._services.client.components.Image
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
