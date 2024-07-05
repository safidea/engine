import type { IconLibrary } from '@domain/services/IconLibrary'
import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { Name } from '@domain/libraries/Icon'

export interface Props extends BaseProps {
  Icon: React.FC<BaseProps>
}

interface Params extends BaseProps {
  name: Name
  Component: ReactComponent<Props>
  iconLibrary: IconLibrary
}

export class Icon implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { Component, iconLibrary, name, ...defaultProps } = this.params
    const Icon = iconLibrary.outline(name)
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, Icon, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
