import { TableApi } from '@adapter/api/TableApi'
import type { EngineError } from '@domain/entities/EngineError'
import type { ReactComponents } from '@domain/entities/page/component'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { TableError } from '@domain/entities/table/TableError'
export type { Table as Config } from '@adapter/api/configs/table/Table'

interface Options {
  components?: Partial<ReactComponents>
}

export default class {
  private api: TableApi

  constructor(
    private config: unknown,
    options?: Options
  ) {
    this.api = new TableApi({
      drivers,
      components: {
        ...components,
        ...options?.components,
      },
    })
  }

  getErrors = (): EngineError[] => this.api.getErrors(this.config)
}
