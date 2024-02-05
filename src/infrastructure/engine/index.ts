import { AppApi } from '@adapter/api/AppApi'
import type { Drivers } from '@adapter/spi'
import type { EngineError } from '@domain/entities/EngineError'
import type { ReactComponents } from '@domain/entities/page/Component'
import type { SpecError } from '@domain/entities/spec/SpecError'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { AppError } from '@domain/entities/app/AppError'
export type { App as Config } from '@adapter/api/configs/App'
export type { Props, ReactComponents } from '@domain/entities/page/Component'
export type { Icon } from '@domain/entities/page/Component/Icon'

interface Options {
  components?: Partial<ReactComponents>
  drivers?: Partial<Drivers>
  databaseUrl?: string
  port?: number
}

export default class {
  private api: AppApi

  constructor(
    private config: unknown,
    options?: Options
  ) {
    this.api = new AppApi({
      ...options,
      drivers: { ...drivers, ...options?.drivers },
      components: { ...components, ...options?.components },
    })
  }

  getErrors = (): EngineError[] => this.api.getErrors(this.config)

  test = async (): Promise<SpecError[]> => this.api.test(this.config)

  start = async (): Promise<string> => this.api.start(this.config)

  stop = async (): Promise<void> => this.api.stop()
}
