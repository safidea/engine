import type { ApiOptions } from '@adapter/api/Api'
import { PageApi } from '@adapter/api/PageApi'
import type { PageDto } from '@adapter/api/dtos/page/PageDto'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { PageError } from '@domain/entities/page/PageError'
export type { PageDto as PageConfig } from '@adapter/api/dtos/page/PageDto'

export default class Page {
  api: PageApi

  constructor(options?: ApiOptions) {
    this.api = new PageApi(
      { ...drivers, ...options?.drivers },
      { ...components, ...options?.components }
    )
  }

  getConfigErrors = (config: unknown) => this.api.getConfigErrors(config)
  isValidConfig = (config: unknown) => this.api.isValidConfig(config)
  createFromConfig = (config: PageDto) => this.api.createFromConfig(config)
}
