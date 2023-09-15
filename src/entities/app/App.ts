import { TableList } from './table/TableList'
import { PageList } from './page/PageList'
import { AutomationList } from './automation/AutomationList'
import { Logger } from '@entities/drivers/logger/Logger'
import { IStorageSpi } from '@entities/drivers/storage/StorageDriver'
import { ITemplatingSpi } from '@entities/drivers/templater/ITemplatingSpi'
import { AppParams } from './AppParams'
import { Converter } from '@entities/drivers/converter/Converter'
import { Database } from '@entities/drivers/database/Database'
import { Fetcher } from '@entities/drivers/fetcher/Fetcher'

export interface AppConfig {
  readonly tables: TableList
}

export interface AppDrivers {
  readonly templater: ITemplatingSpi
  readonly converter: Converter
  readonly storage: IStorageSpi
  readonly database: Database
  readonly fetcher: Fetcher
  readonly logger: Logger
  readonly ui: IUiSpi
}

export class App {
  readonly name: string
  readonly version: string
  readonly tables: TableList
  readonly automations: AutomationList
  readonly pages: PageList

  constructor(
    readonly params: AppParams,
    readonly drivers: AppDrivers
  ) {
    const { name = 'My app', version = '0.0.1', tables = [], automations = [], pages = [] } = params
    this.name = name
    this.version = version
    this.tables = new TableList(tables, drivers)
    this.pages = new PageList(pages, drivers, { tables: this.tables })
    this.automations = new AutomationList(automations, drivers, { tables: this.tables })
  }

  async configure(): Promise<void> {
    const { tables, automations } = this.params
    if (tables) {
      await this.drivers.database.configure(tables)
    }
    if (automations) {
      await this.drivers.database.listen(this.automations.emit)
    }
  }
}
