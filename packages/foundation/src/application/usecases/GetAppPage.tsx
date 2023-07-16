import { AppRepository } from '@adapter/spi/repositories/AppRepository'
import { AppDto } from '@application/dtos/AppDto'
import { ComponentDto } from '@application/dtos/ComponentDto'
import { capitalize } from '@application/utils/StringUtils'
import { TAGS } from '@domain/constants/Tags'
import { ReactElement } from 'react'

export class GetAppPage {
  constructor(private appRepository: AppRepository) {}

  async execute(path: string, appConfig: AppDto): Promise<ReactElement> {
    const { pages } = appConfig
    if (!pages) throw new Error('Pages not found')
    const page = pages.find((page) => page.path === path)
    if (!page) throw new Error(`Page ${path} not found`)
    const Page = this.children(page.components)
    return <Page />
  }

  private getComponent(key: string) {
    const Components = this.appRepository.getComponents()
    const name = capitalize(key)
    if (name in Components) return Components[name]
    return Components.Html
  }

  private getProps(component: ComponentDto) {
    const { key } = component
    switch (key) {
      default:
        if (!TAGS.includes(key)) throw new Error(`Invalid tag: ${key}`)
        return {
          Tag: key as keyof JSX.IntrinsicElements,
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
