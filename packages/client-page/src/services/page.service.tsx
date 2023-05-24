import { Sections, Html, Common } from 'client-component'

import type { ComponentType } from 'client-component'
import type { ComponentsInterface } from 'shared-component'

class PageService {
  public render(components: ComponentsInterface) {
    const tags = Object.keys(components)
    const elements = tags.map((tag, index) => {
      const { components: children, text, ...props } = components[tag]
      const [name, category] = tag.split('.')
      const Component = this.getComponentFromCategory(name, category)
      if (children) {
        const Children = this.render(children)
        return (
          <Component key={index} tag={name} {...props}>
            <Children />
          </Component>
        )
      }
      if (text)
        return (
          <Component key={index} tag={name} {...props}>
            {text}
          </Component>
        )
      return <Component key={index} tag={name} {...props} />
    })
    const Render = () => <>{elements}</>
    return Render
  }

  public getComponentFromCategory(name: string, category?: string): ComponentType {
    let Component: ComponentType
    switch (category) {
      case 'section':
        Component = Sections[name as keyof typeof Sections]
        break
      default:
        Component = Common[name as keyof typeof Common]
        break
    }

    return Component ?? Html
  }
}

export default new PageService()
