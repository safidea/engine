import * as Components from '../components'

import type { PageComponentInterface } from 'shared-page'
import type { ComponentType } from '../types/component.type'
import type { ServerProviderComponentsInterface } from 'shared-common'

type ComponentServiceProps = {
  serverProviderComponents: ServerProviderComponentsInterface
}

class ComponentService {
  private serverProviderComponents: ServerProviderComponentsInterface

  constructor({ serverProviderComponents }: ComponentServiceProps) {
    this.serverProviderComponents = serverProviderComponents
  }

  public get(key: string): ComponentType {
    if (key in Components) return Components[key as keyof typeof Components] as ComponentType
    return Components.default
  }

  public render(component: PageComponentInterface, index: number): JSX.Element {
    const { key, components: children, text, ...res } = component
    const Component = this.get(key)
    const props = {
      ...res,
      tag: key,
      serverProviderComponents: this.serverProviderComponents,
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
