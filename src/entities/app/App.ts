import { TableList } from './table/TableList'
import { PageList } from './page/PageList'
import { AutomationList } from './automation/AutomationList'
import { AppParams } from './AppParams'
import { BucketList } from './bucket/BucketList'
import { AppMappers } from './AppMappers'
import { TriggerEvent } from './automation/trigger/TriggerEvent'

export class App {
  readonly name: string
  readonly version: string
  readonly tables: TableList
  readonly automations: AutomationList
  readonly pages: PageList
  readonly buckets: BucketList

  constructor(
    readonly params: AppParams,
    mappers: AppMappers
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
    this.tables = new TableList(tables, mappers)
    this.buckets = new BucketList(buckets, mappers)
    const config = { tables: this.tables, buckets: this.buckets }
    this.pages = new PageList(pages, mappers, config)
    this.automations = new AutomationList(automations, mappers, config)
  }

  async configure(): Promise<void> {
    if (this.tables.exist()) {
      await this.tables.database.configure(this.tables)
      if (this.automations.exist()) {
        await this.automations.database.listen((event: TriggerEvent) =>
          this.automations.emit(event)
        )
      }
    }
    if (this.buckets.exist()) {
      await this.buckets.storage.configure(this.buckets)
      if (this.automations.exist()) {
        await this.automations.storage.listen((event: TriggerEvent) => this.automations.emit(event))
      }
    }
  }
}
