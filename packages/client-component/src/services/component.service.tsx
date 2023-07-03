import type { PageComponentInterface } from 'shared-page'
import { StringUtils, type AppProviderComponentsInterface } from 'shared-common'

type ComponentServiceProps = {
  appProviderComponents: AppProviderComponentsInterface
}

class ComponentService {
  private appProviderComponents: AppProviderComponentsInterface

  constructor({ appProviderComponents }: ComponentServiceProps) {
    this.appProviderComponents = appProviderComponents
  }

  public get(key: string) {
    const name = StringUtils.capitalize(key)
    if (name in this.appProviderComponents) return this.appProviderComponents[name]
    return this.appProviderComponents.Default
  }

  public render(component: PageComponentInterface, index: number): JSX.Element {
    const { key, components: children, text, ...res } = component
    const Component = this.get(key)
    const props = {
      ...res,
      tag: key,
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
