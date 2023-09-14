import { TableList } from './table/TableList'
import { PageList } from './page/PageList'
import { AutomationList } from './automation/AutomationList'
import { IFetcherSpi } from '@entities/drivers/fetcher/IFetcherSpi'
import { ILoggerSpi } from '@entities/drivers/logger/ILoggerSpi'
import { IStorageSpi } from '@entities/drivers/storage/IStorageSpi'
import { ITemplatingSpi } from '@entities/drivers/templater/ITemplatingSpi'
import { AppOptions } from './AppOptions'
import { Converter } from '@entities/drivers/converter/Converter'
import { Database } from '@entities/drivers/database/Database'

export interface AppConfig {
  readonly tables: TableList
}

export interface AppDrivers {
  readonly templater: ITemplatingSpi
  readonly converter: Converter
  readonly storage: IStorageSpi
  readonly database: Database
  readonly fetcher: IFetcherSpi
  readonly logger: ILoggerSpi
  readonly ui: IUiSpi
}

export class App {
  readonly name: string
  readonly version: string
  readonly tables: TableList
  readonly automations: AutomationList
  readonly pages: PageList

  constructor(
    readonly options: AppOptions,
    readonly drivers: AppDrivers
  ) {
    const {
      name = 'My app',
      version = '0.0.1',
      tables = [],
      automations = [],
      pages = [],
    } = options
    this.name = name
    this.version = version
    this.tables = new TableList(tables, drivers)
    this.pages = new PageList(pages, drivers, { tables: this.tables })
    this.automations = new AutomationList(automations, drivers, { tables: this.tables })
  }

  async configure(): Promise<void> {
    const { tables, automations } = this.options
    if (tables) {
      await this.drivers.database.configure(tables)
    }
    if (automations) {
      await this.drivers.database.listen(this.automations.emit)
    }
  }
}
