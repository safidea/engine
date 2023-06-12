import * as Components from '../components'
import { CustomComponents } from '../types/component.type'

import type { ConfigInterface, FetcherProviderInterface } from 'shared-app'
import type { ComponentInterface } from 'shared-component'
import type { ComponentType } from '../types/component.type'

type ComponentServiceProps = {
  customComponents: CustomComponents
  fetcherProvider: FetcherProviderInterface
  config: ConfigInterface
}

class ComponentService {
  private customComponents: CustomComponents
  private fetcherProvider: FetcherProviderInterface
  private config: ConfigInterface

  constructor({ customComponents, fetcherProvider, config }: ComponentServiceProps) {
    this.customComponents = customComponents
    this.fetcherProvider = fetcherProvider
    this.config = config
  }

  public render(component: ComponentInterface, index: number) {
    const { key, components: children, text, ...res } = component
    const Component = (Components[key as keyof typeof Components] ??
      Components.default) as ComponentType
    const props = {
      ...res,
      key: index,
      tag: key,
      config: this.config,
      customComponents: this.customComponents,
      fetcherProvider: this.fetcherProvider,
    }
    if (children) {
      const Children = this.renderChildren(children)
      return (
        <Component {...props}>
          <Children />
        </Component>
      )
    }
    if (text) return <Component {...props}>{text}</Component>
    return <Component {...props} />
  }

  public renderChildren(components: ComponentInterface[]) {
    const Children = () => <>{components.map((c, i) => this.render(c, i))}</>
    return Children
  }
}

export default ComponentService
