import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { RecordDto } from '@application/dtos/RecordDto'
import { ReadTableRecord } from './ReadTableRecord'
import { FilterDto } from '@application/dtos/FilterDto'

export class ListTableRecords {
  private tableRepository: TableRepository
  private readTableRecord: ReadTableRecord

  constructor(tableRepository: TableRepository) {
    this.tableRepository = tableRepository
    this.readTableRecord = new ReadTableRecord(tableRepository)
  }

  async execute(table: string, filters?: FilterDto[]): Promise<RecordDto[]> {
    const records = await this.tableRepository.list(table, filters)
    for (let record of records) {
      record = await this.readTableRecord.enrichRecord(record, table)
    }
    return records
  }
}
