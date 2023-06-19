import * as Components from '../components'
import { CustomComponents } from '../types/component.type'

import type { ConfigInterface } from 'shared-app'
import type { PageComponentInterface, PageComponentsInterface } from 'shared-page'
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

  public get(key: string, index: number, components?: PageComponentsInterface): ComponentType {
    if (key in Components) return Components[key as keyof typeof Components] as ComponentType
    if (this.config?.components?.[key]) {
      const component = this.config.components[key]
      if (components) component.components = components
      return () => this.render(component, index)
    }
    return Components.default
  }

  public render(component: PageComponentInterface, index: number): JSX.Element {
    const { key, components: children, text, ...res } = component
    const Component = this.get(key, index, children)
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

  public renderChildren(components: PageComponentInterface[]): () => JSX.Element {
    const Children = () => <>{components.map((c, i) => this.render(c, i))}</>
    return Children
  }
}

export default ComponentService
