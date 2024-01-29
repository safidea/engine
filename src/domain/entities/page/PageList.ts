import type { EngineError } from '../EngineError'
import type { IList } from '../IList'
import type { IPage } from './IPage'
import type { IPageParams } from './IPageParams'
import { Page } from './Page.tsx'

export class PageList implements IList<Page> {
  private pages: Page[]

  constructor(config: IPage[], params: IPageParams) {
    this.pages = config.map((page) => new Page(page, params))
  }

  get length() {
    return this.pages.length
  }

  get all() {
    return this.pages
  }

  validateConfig(): EngineError[] {
    return this.pages.flatMap((page) => page.validateConfig())
  }

  includes(name: string) {
    return this.pages.some((page) => page.name === name)
  }

  find(name: string) {
    return this.pages.find((page) => page.name === name)
  }
}
