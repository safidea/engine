import { AutomationApi } from '@adapter/api/AutomationApi'
import type { EngineError } from '@domain/entities/EngineError'
import type { ReactComponents } from '@domain/entities/page/component'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { AutomationError } from '@domain/entities/automation/AutomationError'
export type { Automation as Config } from '@adapter/api/configs/automation/Automation'

interface Options {
  components?: Partial<ReactComponents>
}

export default class {
  private api: AutomationApi

  constructor(
    private config: unknown,
    options?: Options
  ) {
    this.api = new AutomationApi({
      drivers,
      components: {
        ...components,
        ...options?.components,
      },
    })
  }

  getErrors = (): EngineError[] => this.api.getErrors(this.config)
}
