import type { IconLibrary } from '@domain/services/IconLibrary'
import type { Base, BaseProps, BaseServices } from '../base'
import type { Name } from '@domain/libraries/Icon'

export interface Props extends BaseProps {
  Icon: React.FC<BaseProps>
}

export interface Config extends BaseProps {
  name: Name
}

export interface Services extends BaseServices {
  iconLibrary: IconLibrary
}

export class Icon implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  init = async () => {}

  render = async () => {
    const { name, ...defaultProps } = this._config
    const { iconLibrary } = this._services
    const Component = this._services.client.components.Icon
    const Icon = iconLibrary.outline(name)
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, Icon, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
