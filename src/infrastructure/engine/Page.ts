import type { ApiOptions } from '@adapter/api/Api'
import { PageApi } from '@adapter/api/PageApi'
import type { Page } from '@adapter/api/configs/page/Page'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { PageError } from '@domain/entities/page/PageError'
export type { Page } from '@adapter/api/configs/page/Page'

export default class {
  api: PageApi

  constructor(options?: ApiOptions) {
    this.api = new PageApi(
      { ...drivers, ...options?.drivers },
      { ...components, ...options?.components }
    )
  }

  getConfigErrors = (config: unknown) => this.api.getConfigErrors(config)
  isValidConfig = (config: unknown) => this.api.isValidConfig(config)
  createFromConfig = (config: Page) => this.api.createFromConfig(config)
}
