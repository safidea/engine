import { Components } from 'client-component'

import type { ComponentType } from 'client-component'
import type { ComponentsInterface } from 'shared-component'
import type { ConfigInterface } from 'shared-app'

class PageService {
  public render(components: ComponentsInterface, config: ConfigInterface) {
    const elements = components.map((component, index) => {
      const { key, components: children, text, ...props } = component
      const Component = (Components[key as keyof typeof Components] ??
        Components.default) as ComponentType
      if (children) {
        const Children = this.render(children, config)
        return (
          <Component key={index} tag={key} {...props} config={config}>
            <Children />
          </Component>
        )
      }
      if (text)
        return (
          <Component key={index} tag={key} {...props} config={config}>
            {text}
          </Component>
        )
      return <Component key={index} tag={key} {...props} config={config} />
    })
    const Render = () => <>{elements}</>
    return Render
  }
}

export default new PageService()
