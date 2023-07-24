import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { RecordDto, RecordToUpdateDto } from '@application/dtos/RecordDto'
import { mapDtoToRecord } from '@application/mappers/RecordMapper'

export class UpdateTableRecord {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string, recordToUpdateDto: RecordToUpdateDto, id: string): Promise<void> {
    const recordDto = Object.keys(recordToUpdateDto).reduce((acc: RecordDto, field: string) => {
      const value = recordToUpdateDto[field]
      if (typeof value !== 'object') {
        acc[field] = value
      }
      return acc
    }, {})
    recordDto.last_modified_time = new Date().toISOString()
    await this.tableRepository.update(table, mapDtoToRecord(table, { ...recordDto, id }), id)
  }
}
