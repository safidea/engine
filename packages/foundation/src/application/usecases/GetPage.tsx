import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { App } from '@domain/entities/App'
import { Component } from '@domain/entities/Component'
import { ReactElement } from 'react'
import { IUIRepository } from '@domain/repositories/IUIRepository'

export class GetPage {
  private readonly _ui: IUIRepository

  constructor(
    private pageRepository: PageRepository,
    private app: App
  ) {
    this._ui = this.pageRepository.getUI()
  }

  async execute(path: string): Promise<ReactElement> {
    const { pages } = this.app
    if (!pages) throw new Error('Pages not found')
    const page = pages.find((page) => page.path === path)
    if (!page) throw new Error(`Page ${path} not found`)
    const Page = this.children(page.components)
    return <Page />
  }

  private render(component: Component, index: number) {
    const Component = component.render
    return <Component key={index} />
  }

  private children(components: Component[]) {
    const Children = () => <>{components.map((c, i) => this.render(c, i))}</>
    return Children
  }
}
