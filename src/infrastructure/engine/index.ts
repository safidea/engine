import { AppApi } from '@adapter/api/AppApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { AppError } from '@domain/entities/app/AppError'
export type { App } from '@adapter/api/configs/App'
export type { Props } from '@domain/entities/page/Component'

class App {
  constructor(private api: AppApi) {}
  getErrors = (config: unknown) => this.api.getConfigErrors(config)
  validate = (config: unknown) => this.api.isValidConfig(config)
}

export default new App(new AppApi(drivers, components))
