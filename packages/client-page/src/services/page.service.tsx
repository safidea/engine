import { Sections, Html, Common, Lists, Forms } from 'client-component'

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
    let Component
    switch (category) {
      case 'section':
        Component = Sections[name as keyof typeof Sections]
        break
      case 'list':
        Component = Lists[name as keyof typeof Lists]
        break
      case 'form':
        Component = Forms[name as keyof typeof Forms]
        break
      default:
        Component = Common[name as keyof typeof Common]
        break
    }

    return (Component ?? Html) as unknown as ComponentType
  }
}

export default new PageService()
