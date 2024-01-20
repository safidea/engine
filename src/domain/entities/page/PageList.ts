import type { IList } from '../IList'
import type { IPage } from './IPage'
import type { IPageParams } from './IPageParams'
import { PageEntity } from './PageEntity'
import type { PageError } from './PageError'

export class PageList implements IList<PageEntity> {
  pages: PageEntity[]
  errors: PageError[] = []

  constructor(
    public config: IPage[],
    params: IPageParams
  ) {
    this.pages = config.map((page) => new PageEntity(page, params))
    if (this.pages.some((page) => page.errors.length)) {
      this.errors = this.pages.flatMap((page) => page.errors)
    }
  }

  includes(name: string) {
    return this.pages.some((page) => page.config.name === name)
  }

  find(name: string) {
    return this.pages.find((page) => page.config.name === name)
  }
}
