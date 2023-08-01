import { AppGateway } from '@adapter/spi/gateways/AppGateway'
import { OrmGateway } from '@adapter/spi/gateways/OrmGateway'
import { RecordDto } from '@application/dtos/table/RecordDto'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'

export class DeleteTableRecord {
  constructor(
    private ormGateway: OrmGateway,
    private appGateway: AppGateway
  ) {}

  async execute(table: string, id: string): Promise<void> {
    const fields = this.appGateway.getTableFields(table)
    const recordDto: RecordDto = {
      deleted_time: new Date().toISOString(),
    }
    await this.ormGateway.update(table, mapDtoToRecord(table, { ...recordDto, id }, fields, 'deleted'), id)
  }
}
