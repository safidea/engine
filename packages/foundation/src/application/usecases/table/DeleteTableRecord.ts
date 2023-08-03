import { OrmGateway } from '@adapter/spi/gateways/OrmGateway'
import { RecordDto } from '@application/dtos/table/RecordDto'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'
import { App } from '@domain/entities/App'

export class DeleteTableRecord {
  constructor(
    private ormGateway: OrmGateway,
    private app: App
  ) {}

  async execute(table: string, id: string): Promise<void> {
    const fields = this.app.getTableFields(table)
    const recordDto: RecordDto = {
      deleted_time: new Date().toISOString(),
    }
    await this.ormGateway.update(
      table,
      mapDtoToRecord(table, { ...recordDto, id }, fields, 'deleted'),
      id
    )
  }
}
