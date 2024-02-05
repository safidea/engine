import { PageApi } from '@adapter/api/PageApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { PageError } from '@domain/entities/page/PageError'
export type { Page } from '@adapter/api/configs/page/Page'

class Page {
  constructor(private api: PageApi) {}
  getErrors = (config: unknown) => this.api.getConfigErrors(config)
  validate = (config: unknown) => this.api.isValidConfig(config)
}

export default new Page(new PageApi(drivers, components))
