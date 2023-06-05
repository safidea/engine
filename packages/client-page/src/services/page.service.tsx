import { Components } from 'client-component'

import type { ComponentType } from 'client-component'
import type { ComponentsInterface } from 'shared-component'

class PageService {
  public render(components: ComponentsInterface) {
    const elements = components.map((component, index) => {
      const { key, components: children, text, ...props } = component
      const Component = (Components[key as keyof typeof Components] ??
        Components.default) as ComponentType
      if (children) {
        const Children = this.render(children)
        return (
          <Component key={index} tag={key} {...props}>
            <Children />
          </Component>
        )
      }
      if (text)
        return (
          <Component key={index} tag={key} {...props}>
            {text}
          </Component>
        )
      return <Component key={index} tag={key} {...props} />
    })
    const Render = () => <>{elements}</>
    return Render
  }
}

export default new PageService()
