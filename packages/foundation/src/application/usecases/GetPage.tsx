import { AppController } from '@adapter/api/controllers/AppController'
import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { ComponentDto } from '@application/dtos/ComponentDto'
import { capitalize } from '@application/utils/StringUtils'
import { TAGS } from '@domain/constants/Tags'
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
    const Page = this.children(page.components)
    return <Page />
  }

  private getComponent(key: string) {
    const name = capitalize(key)
    return this.pageRepository.getComponent(name)
  }

  private getProps(component: ComponentDto) {
    const { key, href } = component
    switch (key) {
      default:
        if (!TAGS.includes(key)) throw new Error(`Invalid tag: ${key}`)
        return {
          Tag: key as keyof JSX.IntrinsicElements,
          href, // only supported by a the A tag
        }
    }
  }

  private render(component: ComponentDto, index: number) {
    const { key, text } = component
    const Component = this.getComponent(key)
    const props = this.getProps(component)
    if (text)
      return (
        <Component key={index} {...props}>
          {text}
        </Component>
      )
    return <Component key={index} {...props} />
  }

  private children(components: ComponentDto[]) {
    const Children = () => <>{components.map((c, i) => this.render(c, i))}</>
    return Children
  }
}
