import { TableGateway } from '@adapter/spi/gateways/TableGateway'
import { RecordDto, RecordToUpdateDto } from '@application/dtos/table/RecordDto'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'

export class UpdateTableRecord {
  constructor(private TableGateway: TableGateway) {}

  async execute(table: string, recordToUpdateDto: RecordToUpdateDto, id: string): Promise<void> {
    const recordDto = Object.keys(recordToUpdateDto).reduce((acc: RecordDto, field: string) => {
      const value = recordToUpdateDto[field]
      if (typeof value !== 'object') {
        acc[field] = value
      }
      return acc
    }, {})
    recordDto.last_modified_time = new Date().toISOString()
    await this.TableGateway.update(table, mapDtoToRecord(table, { ...recordDto, id }), id)
  }
}
