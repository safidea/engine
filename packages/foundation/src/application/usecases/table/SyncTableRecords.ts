import { OrmGatewayAbstract } from '@application/gateways/OrmGatewayAbstract'
import { Record } from '@domain/entities/app/Record'

interface TableToHandle {
  table: string
  records: Record[]
}

export class SyncTableRecords {
  constructor(private ormGateway: OrmGatewayAbstract) {}

  async execute(records: Record[]) {
    const recordsToCreate: TableToHandle[] = []
    const recordsToUpdate: TableToHandle[] = []
    for (const record of records) {
      switch (record.state) {
        case 'create':
          const recordsToCreateTable = recordsToCreate.find((r) => r.table === record.table.name)
          if (recordsToCreateTable) {
            recordsToCreateTable.records.push(record)
          } else {
            recordsToCreate.push({
              table: record.table.name,
              records: [record],
            })
          }
          break
        case 'update':
          const recordsToUpdateTable = recordsToUpdate.find((r) => r.table === record.table.name)
          if (recordsToUpdateTable) {
            recordsToUpdateTable.records.push(record)
          } else {
            recordsToUpdate.push({
              table: record.table.name,
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
}
