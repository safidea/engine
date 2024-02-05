import type { Params as SpisParams } from '@adapter/spi'
import { PageMapper, type Params } from './mappers/page/PageMapper'
import type { Page } from '@domain/entities/page/Page'
import { PageError } from '@domain/entities/page/PageError'
import type { Page as PageConfig } from './configs/page/Page'
import { Api } from './Api'

export class PageApi extends Api<PageConfig, PageError, Page, Params> {
  constructor(params: SpisParams) {
    super(params, PageMapper, 'page')
  }

  getHtml = (config: unknown): string => {
    if (!this.validate(config)) throw new Error('Invalid config')
    const page = this.mapper.toEntityFromServices(config, this.services)
    return page.html()
  }
}
