import type { ConfigError } from '@domain/entities/Error/Config'
import type { Icon } from './Icon'
import type { Base, BaseProps, Font, BaseServices } from '../base'
import type { PageState } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  label: string
  href: string
  active?: boolean
  PrefixIcon?: React.FC<BaseProps>
  SuffixIcon?: React.FC<BaseProps>
  font?: Font
}

export type Config = Omit<Props, 'PrefixIcon' | 'SuffixIcon'>

export type Services = BaseServices

export interface Entities {
  prefixIcon?: Icon
  suffixIcon?: Icon
}

export class Link implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  init = async () => {
    const { prefixIcon, suffixIcon } = this._entities
    await Promise.all([prefixIcon?.init(), suffixIcon?.init()])
  }

  render = async (state: PageState) => {
    const { active: isActive, ...defaultProps } = this._config
    const { prefixIcon, suffixIcon } = this._entities
    const PrefixIcon = prefixIcon ? await prefixIcon.render() : undefined
    const SuffixIcon = suffixIcon ? await suffixIcon.render() : undefined
    const active = isActive !== undefined ? isActive : state.isActiveLink(defaultProps.href)
    const Component = this._services.client.components.Link
    return (props?: Partial<Props>) => (
      <Component {...{ PrefixIcon, SuffixIcon, ...defaultProps, active, ...props }} />
    )
  }

  validateConfig = () => {
    const { prefixIcon, suffixIcon } = this._entities
    const errors: ConfigError[] = []
    if (prefixIcon) {
      errors.push(...prefixIcon.validateConfig())
    }
    if (suffixIcon) {
      errors.push(...suffixIcon.validateConfig())
    }
    return errors
  }
}
