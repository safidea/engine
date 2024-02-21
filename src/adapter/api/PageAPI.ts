import type { Params as SpisParams } from '@adapter/spi'
import { PageMapper, type Params } from './mappers/page/PageMapper'
import type { Page } from '@domain/engine/page/Page'
import type { Page as Config } from './configs/page/Page'
import { Base } from './base'

export class PageApi extends Base<Config, Page, Params> {
  constructor(params: SpisParams) {
    super(params, PageMapper, 'page')
  }

  getHtml = (config: unknown): string => {
    const page = this.mapper.toEntityFromServices(this.prepareConfig(config), this.services)
    return page.html()
  }
}
