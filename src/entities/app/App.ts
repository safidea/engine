import { TableList } from './table/TableList'
import { PageList } from './page/PageList'
import { AutomationList } from './automation/AutomationList'
import { ITemplaterService } from '@entities/services/templater/ITemplaterService'
import { AppParams } from './AppParams'
import { IDatabaseService } from '@entities/services/database/IDatabaseService'
import { IConverterService } from '@entities/services/converter/IConverterService'
import { IFetcherService } from '@entities/services/fetcher/IFetcherService'
import { ILoggerService } from '@entities/services/logger/ILoggerService'
import { IStorageService } from '@entities/services/storage/IStorageService'
import { IUIService } from '@entities/services/ui/IUIService'

export interface AppConfig {
  readonly tables: TableList
}

export interface AppServices {
  readonly templater: ITemplaterService
  readonly converter: IConverterService
  readonly storage: IStorageService
  readonly database: IDatabaseService
  readonly fetcher: IFetcherService
  readonly logger: ILoggerService
  readonly ui: IUIService
}

export class App {
  readonly name: string
  readonly version: string
  readonly tables: TableList
  readonly automations: AutomationList
  readonly pages: PageList

  constructor(
    readonly params: AppParams,
    readonly services: AppServices
  ) {
    const { name = 'My app', version = '0.0.1', tables = [], automations = [], pages = [] } = params
    this.name = name
    this.version = version
    this.tables = new TableList(tables, services)
    const config = { tables: this.tables }
    this.pages = new PageList(pages, services, config)
    this.automations = new AutomationList(automations, services, config)
  }

  async configure(): Promise<void> {
    const { tables, automations } = this.params
    if (tables) {
      await this.services.database.configure(tables)
    }
    if (automations) {
      await this.services.database.listen(this.automations.emit)
      await this.services.storage.listen(this.automations.emit)
    }
  }
}
