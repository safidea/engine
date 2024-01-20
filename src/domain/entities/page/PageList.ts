import type { IPage } from './IPage'
import { PageEntity } from './PageEntity'

export class PageList {
  pages: PageEntity[]

  constructor(public config: IPage[]) {
    this.pages = config.map((page) => new PageEntity(page))
  }
}
