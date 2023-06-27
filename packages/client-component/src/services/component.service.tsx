import * as Components from '../components'

import type { PageComponentInterface } from 'shared-page'
import type { ComponentType } from '../types/component.type'
import type { AppProviderComponentsInterface } from 'shared-common'

type ComponentServiceProps = {
  appProviderComponents: AppProviderComponentsInterface
}

class ComponentService {
  private appProviderComponents: AppProviderComponentsInterface

  constructor({ appProviderComponents }: ComponentServiceProps) {
    this.appProviderComponents = appProviderComponents
  }

  public get(key: string): ComponentType {
    const { appProviderComponents } = this
    if (key in appProviderComponents)
      return appProviderComponents[key as keyof typeof appProviderComponents] as ComponentType
    if (key in Components) return Components[key as keyof typeof Components] as ComponentType
    return Components.default
  }

  public render(component: PageComponentInterface, index: number): JSX.Element {
    const { key, components: children, text, ...res } = component
    const Component = this.get(key)
    const props = {
      ...res,
      tag: key,
      appProviderComponents: this.appProviderComponents,
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
