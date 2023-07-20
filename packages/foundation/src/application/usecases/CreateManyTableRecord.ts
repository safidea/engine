import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { RecordToCreateDto } from '@application/dtos/RecordDto'
import { mapDtoToRecord } from '@application/mappers/RecordMapper'
import { CreateTableRecord } from './CreateTableRecord'

export class CreateManyTableRecord {
  private createTableRecord: CreateTableRecord

  constructor(private tableRepository: TableRepository) {
    this.createTableRecord = new CreateTableRecord(tableRepository)
  }

  async execute(table: string, records: RecordToCreateDto[]): Promise<string[]> {
    const recordsDtos = await Promise.all(
      records.map((record) => this.createTableRecord.buildRecordDto(table, record))
    )
    return this.tableRepository.createMany(
      table,
      recordsDtos.map((record) => mapDtoToRecord(table, record))
    )
  }
}
