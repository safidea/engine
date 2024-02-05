import { type Drivers } from '@adapter/spi'
import { PageMapper } from './mappers/page/PageMapper'
import type { Page } from '@domain/entities/page/Page'
import { PageError } from '@domain/entities/page/PageError'
import type { Page as PageConfig } from './configs/page/Page'
import type { ReactComponents } from '@domain/entities/page/Component'
import { Api } from './Api'

export class PageApi extends Api<PageConfig, PageError, Page> {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components, PageMapper, 'page')
  }
}
