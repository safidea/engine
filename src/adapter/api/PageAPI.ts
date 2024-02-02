import { type Drivers } from '@adapter/spi'
import { PageMapper } from './mappers/PageMapper'
import type { Page } from '@domain/entities/Page'
import { PageError } from '@domain/entities/PageError'
import type { PageDto } from './dtos/PageDto'
import type { ReactComponents } from '@domain/entities/Component'
import { Api } from './Api'

export class PageApi extends Api<PageDto, PageError, Page> {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components, PageMapper, 'page')
  }
}
