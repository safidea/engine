import type { IList } from '../IList'
import type { IPage } from './IPage'
import type { IPageParams } from './IPageParams'
import { PageEntity } from './PageEntity'

export class PageList implements IList<PageEntity> {
  pages: PageEntity[]

  constructor(
    public config: IPage[],
    params: IPageParams
  ) {
    this.pages = config.map((page) => new PageEntity(page, params))
  }

  includes(name: string) {
    return this.pages.some((page) => page.config.name === name)
  }

  find(name: string) {
    return this.pages.find((page) => page.config.name === name)
  }
}
