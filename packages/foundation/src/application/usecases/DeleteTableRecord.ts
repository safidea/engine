import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { RecordDto } from '@application/dtos/RecordDto'
import { mapDtoToRecord } from '@application/mappers/RecordMapper'

export class DeleteTableRecord {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string, id: string): Promise<void> {
    const recordDto: RecordDto = {
      deleted_time: new Date().toISOString(),
    }
    await this.tableRepository.update(table, mapDtoToRecord(table, { ...recordDto, id }), id)
  }
}
