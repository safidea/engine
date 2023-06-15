import * as Components from '../components'
import { CustomComponents } from '../types/component.type'

import type { ConfigInterface } from 'shared-app'
import type { ComponentInterface } from 'shared-component'
import type { ComponentType } from '../types/component.type'

type ComponentServiceProps = {
  customComponents: CustomComponents
  config: ConfigInterface
}

class ComponentService {
  private customComponents: CustomComponents
  private config: ConfigInterface

  constructor({ customComponents, config }: ComponentServiceProps) {
    this.customComponents = customComponents
    this.config = config
  }

  public render(component: ComponentInterface, index: number) {
    const { key, components: children, text, ...res } = component
    const Component = (Components[key as keyof typeof Components] ??
      Components.default) as ComponentType
    const props = {
      ...res,
      tag: key,
      config: this.config,
      customComponents: this.customComponents,
    }
    if (children) {
      const Children = this.renderChildren(children)
      return (
        <Component key={index} {...props}>
          <Children />
        </Component>
      )
    }
    if (text)
      return (
        <Component key={index} {...props}>
          {text}
        </Component>
      )
    return <Component key={index} {...props} />
  }

  public renderChildren(components: ComponentInterface[]) {
    const Children = () => <>{components.map((c, i) => this.render(c, i))}</>
    return Children
  }
}

export default ComponentService
