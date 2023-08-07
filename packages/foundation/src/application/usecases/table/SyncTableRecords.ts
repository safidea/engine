import { OrmGatewayAbstract } from '@application/gateways/OrmGatewayAbstract'
import { Record } from '@domain/entities/app/Record'
import { SyncResource, SyncTables } from '@domain/entities/app/Sync'

export interface TableToHandle {
  table: string
  records: Record[]
}

export class SyncTableRecords {
  constructor(private ormGateway: OrmGatewayAbstract) {}

  async execute(records: Record[] = [], resources: SyncResource[] = []): Promise<SyncTables> {
    if (records.length > 0) {
      const recordsToCreate: TableToHandle[] = []
      const recordsToUpdate: TableToHandle[] = []
      for (const record of records) {
        switch (record.state) {
          case 'create':
            const recordsToCreateTable = recordsToCreate.find((r) => r.table === record.tableName)
            if (recordsToCreateTable) {
              recordsToCreateTable.records.push(record)
            } else {
              recordsToCreate.push({
                table: record.tableName,
                records: [record],
              })
            }
            break
          case 'update':
            const recordsToUpdateTable = recordsToUpdate.find((r) => r.table === record.tableName)
            if (recordsToUpdateTable) {
              recordsToUpdateTable.records.push(record)
            } else {
              recordsToUpdate.push({
                table: record.tableName,
                records: [record],
              })
            }
            break
          default:
            throw new Error('Record state not supported')
        }
      }
      const promises = []
      for (const { table, records } of recordsToCreate) {
        promises.push(this.ormGateway.createMany(table, records))
      }
      for (const { table, records } of recordsToUpdate) {
        promises.push(this.ormGateway.updateMany(table, records))
      }
      await Promise.all(promises)
    }

    const tables: SyncTables = {}

    if (resources.length > 0) {
      const promises = []
      for (const { table, filters } of resources) {
        promises.push(
          this.ormGateway.list(table, filters ?? []).then((records) => (tables[table] = records))
        )
      }
      await Promise.all(promises)
    }

    return tables
  }
}
