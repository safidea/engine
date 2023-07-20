import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { capitalize } from '@application/utils/StringUtils'
import { App } from '@domain/entities/App'
import { Component } from '@domain/entities/Component'
import { Link } from '@domain/entities/components/Link'
import { Paragraph } from '@domain/entities/components/Paragraph'
import { ReactElement } from 'react'

export class GetPage {
  constructor(
    private pageRepository: PageRepository,
    private app: App
  ) {}

  async execute(path: string): Promise<ReactElement> {
    const { pages } = this.app
    if (!pages) throw new Error('Pages not found')
    const page = pages.find((page) => page.path === path)
    if (!page) throw new Error(`Page ${path} not found`)
    const Page = this.children(page.components)
    return <Page />
  }

  private getComponent(type: Component['type']) {
    const name = capitalize(type)
    return this.pageRepository.getComponent(name)
  }

  private getProps(component: Component) {
    const { type } = component
    if (component instanceof Link) {
      return {
        Tag: 'a' as keyof JSX.IntrinsicElements,
        href: component.href,
      }
    }
    if (component instanceof Paragraph) {
      return {
        Tag: 'p' as keyof JSX.IntrinsicElements,
      }
    }
    throw new Error(`Component type ${type} not found`)
  }

  private render(component: Component, index: number) {
    const { type } = component
    const Component = this.getComponent(type)
    const props = this.getProps(component)
    if ('text' in component) {
      return (
        <Component key={index} {...props}>
          {component.text}
        </Component>
      )
    }
    return <Component key={index} {...props} />
  }

  private children(components: Component[]) {
    const Children = () => <>{components.map((c, i) => this.render(c, i))}</>
    return Children
  }
}
