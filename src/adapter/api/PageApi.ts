import type { Params as SpisParams } from '@adapter/spi'
import { PageMapper, type Params } from './mappers/page/PageMapper'
import type { Page } from '@domain/engine/page/Page'
import type { Page as Config } from './configs/page/Page'
import { BaseApi } from './BaseApi'
import { State } from '@domain/engine/page/State'
import { RequestMapper } from '@adapter/spi/mappers/RequestMapper'
import type { GetDto } from '@adapter/spi/dtos/RequestDto'

export class PageApi extends BaseApi<Config, Page, Params> {
  constructor(params: SpisParams) {
    super(params, PageMapper, 'page')
  }

  getHtml = async (
    config: unknown,
    request: GetDto = { path: '/', baseUrl: 'http://localhost:3000' }
  ): Promise<string> => {
    const page = await this.validateOrThrow(config)
    const get = RequestMapper.toGetService(request)
    const state = new State(get)
    return page.html(state)
  }
}
