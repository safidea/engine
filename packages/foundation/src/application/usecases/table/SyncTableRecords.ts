import { App } from '@domain/entities/App'
import { IOrmGateway } from '@domain/gateways/IOrmGateway'

export class SyncTableRecords {
  constructor(
    private orm: IOrmGateway,
    private app: App
  ) {}

  async execute(tableName: string, records: any[]) {
    const fields = this.app.getTableFields(tableName)
    const fieldNames = fields.map((field) => field.name)

    const recordsToSync = records.map((record: any) => {
      const recordToSync: any = { id: record.id }
      fieldNames.forEach((fieldName: string) => {
        recordToSync[fieldName] = record[fieldName]
      })
      return recordToSync
    })

    //await this.orm.update(tableName, recordsToSync)
  }
}
