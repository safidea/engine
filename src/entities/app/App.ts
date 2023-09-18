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
import { BucketList } from './bucket/BucketList'

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
  readonly buckets: BucketList

  constructor(
    readonly params: AppParams,
    readonly services: AppServices
  ) {
    const {
      name = 'My app',
      version = '0.0.1',
      tables = [],
      automations = [],
      pages = [],
      buckets = [],
    } = params
    this.name = name
    this.version = version
    this.tables = new TableList(tables, services)
    const config = { tables: this.tables }
    this.pages = new PageList(pages, services, config)
    this.automations = new AutomationList(automations, services, config)
    this.buckets = new BucketList(buckets, services)
  }

  async configure(): Promise<void> {
    const { tables, automations } = this.params
    if (tables) {
      await this.services.database.configure(this.tables)
    }
    if (automations) {
      await this.services.database.listen(this.automations.emit)
      await this.services.storage.listen(this.automations.emit)
    }
  }
}
