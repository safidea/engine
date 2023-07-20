import { AppController } from '@adapter/api/controllers/AppController'
import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { capitalize } from '@application/utils/StringUtils'
import { TAGS } from '@domain/constants/Tags'
import { Component } from '@domain/entities/Component'
import { Link } from '@domain/entities/components/Link'
import { Paragraph } from '@domain/entities/components/Paragraph'
import { ReactElement } from 'react'

export class GetPage {
  constructor(
    private pageRepository: PageRepository,
    private appController: AppController
  ) {}

  async execute(path: string): Promise<ReactElement> {
    const { pages } = this.appController.get()
    if (!pages) throw new Error('Pages not found')
    const page = pages.find((page) => page.path === path)
    if (!page) throw new Error(`Page ${path} not found`)
    const Page = this.children(page.components as any)
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
    } else {
      if (!TAGS.includes(type)) throw new Error(`Invalid tag: ${type}`)
      return {
        Tag: type as keyof JSX.IntrinsicElements,
      }
    }
  }

  private render(component: Component, index: number) {
    const { type } = component
    const Component = this.getComponent(type)
    const props = this.getProps(component)
    if (component instanceof Paragraph || component instanceof Link) {
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
