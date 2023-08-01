import { AppGateway } from '@adapter/spi/gateways/AppGateway'
import { OrmGateway } from '@adapter/spi/gateways/OrmGateway'
import { RecordDto, RecordToUpdateDto } from '@application/dtos/table/RecordDto'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'

export class UpdateTableRecord {
  constructor(
    private ormGateway: OrmGateway,
    private appGateway: AppGateway
  ) {}

  async execute(table: string, recordToUpdateDto: RecordToUpdateDto, id: string): Promise<void> {
    const fields = this.appGateway.getTableFields(table)
    const recordDto = Object.keys(recordToUpdateDto).reduce((acc: RecordDto, field: string) => {
      const value = recordToUpdateDto[field]
      if (typeof value !== 'object') {
        acc[field] = value
      }
      return acc
    }, {})
    recordDto.last_modified_time = new Date().toISOString()
    await this.ormGateway.update(table, mapDtoToRecord(table, { ...recordDto, id }, fields, 'updated'), id)
  }
}
