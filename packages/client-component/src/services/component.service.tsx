import type { PageComponentInterface } from 'shared-page'
import { StringUtils, type AppProviderComponentsInterface } from 'shared-common'
import { CommonProps } from 'shared-component'

type ComponentServiceProps = {
  appProviderComponents: AppProviderComponentsInterface
}

type ParentProps = {
  pathParams: { [key: string]: string }
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

  public render(
    component: PageComponentInterface,
    index: number,
    parentProps: ParentProps
  ): JSX.Element {
    const { key, components: children, text, ...componentConfig } = component
    const Component = this.get(key)
    const props: CommonProps = {
      ...componentConfig,
      tag: key,
    }
    if (key === 'form') {
      props.pathParams = parentProps.pathParams
    }
    if (children) {
      const Children = this.renderChildren(children)
      return (
        <Component key={index} {...props}>
          <Children {...parentProps} />
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

  public renderChildren(components: PageComponentInterface[]): (props: ParentProps) => JSX.Element {
    const Children = (p: ParentProps) => <>{components.map((c, i) => this.render(c, i, p))}</>
    return Children
  }
}

export default ComponentService
