import { type Drivers } from '@adapter/spi'
import { PageMapper } from './mappers/page/PageMapper'
import type { Page } from '@domain/entities/page/Page'
import { PageError } from '@domain/entities/page/PageError'
import type { PageDto } from './dtos/page/PageDto'
import type { ReactComponents } from '@domain/entities/page/Component'
import { Api } from './Api'

export class PageApi extends Api<PageDto, PageError, Page> {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components, PageMapper, 'page')
  }
}
