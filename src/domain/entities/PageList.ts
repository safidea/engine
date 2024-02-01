import type { EngineError } from './EngineError.ts'
import type { EngineList } from './EngineList.ts'
import { Page, type PageConfig, type PageParams } from './Page.tsx'

export class PageList implements EngineList<Page> {
  private pages: Page[]

  constructor(config: PageConfig[], params: PageParams) {
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
