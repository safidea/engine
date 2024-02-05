import { PageApi } from '@adapter/api/PageApi'
import type { EngineError } from '@domain/entities/EngineError'
import type { ReactComponents } from '@domain/entities/page/Component'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { PageError } from '@domain/entities/page/PageError'
export type { Page as Config } from '@adapter/api/configs/page/Page'

interface Options {
  components?: Partial<ReactComponents>
}

export default class {
  private api: PageApi

  constructor(
    private config: unknown,
    options?: Options
  ) {
    this.api = new PageApi({
      drivers,
      components: {
        ...components,
        ...options?.components,
      },
    })
  }

  getErrors = (): EngineError[] => this.api.getErrors(this.config)

  getHtml = (): string => this.api.getHtml(this.config)
}
