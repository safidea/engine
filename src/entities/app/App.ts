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
  readonly buckets: BucketList
}

export interface AppServices {
  readonly ui?: IUIService
  readonly fetcher?: IFetcherService
  readonly templater?: ITemplaterService
  readonly converter?: IConverterService
  readonly storage?: IStorageService
  readonly database?: IDatabaseService
  readonly logger?: ILoggerService
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
    this.buckets = new BucketList(buckets, services)
    const config = { tables: this.tables, buckets: this.buckets }
    this.pages = new PageList(pages, services, config)
    this.automations = new AutomationList(automations, services, config)
  }

  async configure(): Promise<void> {
    if (this.tables.exist()) {
      await this.tables.services.database.configure(this.tables)
    }
    if (this.automations.exist()) {
      await this.automations.services.database.listen(this.automations.emit)
      await this.automations.services.storage.listen(this.automations.emit)
    }
  }
}
