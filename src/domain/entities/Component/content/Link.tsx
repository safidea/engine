import type { ConfigError } from '@domain/entities/Error/Config'
import type { Icon } from './Icon'
import type { ReactComponent, Base, BaseProps, Font } from '../base/base'
import type { State } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  label: string
  href: string
  active?: boolean
  PrefixIcon?: React.FC<BaseProps>
  SuffixIcon?: React.FC<BaseProps>
  font?: Font
}

interface Params extends Omit<Props, 'PrefixIcon' | 'SuffixIcon'> {
  prefixIcon?: Icon
  suffixIcon?: Icon
  Component: ReactComponent<Props>
}

export class Link implements Base<Props> {
  constructor(private _params: Params) {}

  init = async () => {
    const { prefixIcon, suffixIcon } = this._params
    await Promise.all([prefixIcon?.init(), suffixIcon?.init()])
  }

  render = async (state: State) => {
    const { Component, prefixIcon, suffixIcon, active: isActive, ...defaultProps } = this._params
    const PrefixIcon = prefixIcon ? await prefixIcon.render() : undefined
    const SuffixIcon = suffixIcon ? await suffixIcon.render() : undefined
    const active = isActive !== undefined ? isActive : state.isActiveLink(defaultProps.href)
    return (props?: Partial<Props>) => (
      <Component {...{ PrefixIcon, SuffixIcon, ...defaultProps, active, ...props }} />
    )
  }

  validateConfig = () => {
    const { prefixIcon, suffixIcon } = this._params
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
