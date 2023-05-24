import { Components, Html } from 'client-component'

import type { ComponentType } from 'client-component'
import type { ComponentsInterface } from 'shared-component'

class PageService {
  render(components: ComponentsInterface) {
    const tags = Object.keys(components)
    const elements = tags.map((tag, index) => {
      const { components: children, text, ...props } = components[tag]
      const Component: ComponentType = Components[tag as keyof typeof Components] ?? Html
      if (children) {
        const Children = this.render(children)
        return (
          <Component key={index} tag={tag} {...props}>
            <Children />
          </Component>
        )
      }
      if (text)
        return (
          <Component key={index} tag={tag} {...props}>
            {text}
          </Component>
        )
      return <Component key={index} tag={tag} {...props} />
    })
    const Render = () => <>{elements}</>
    return Render
  }
}

export default new PageService()
