import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { ReadTableRecord } from './ReadTableRecord'
import { Record } from '@domain/entities/Record'
import { FilterDto } from '@application/dtos/FilterDto'
import { mapDtoToFilter } from '@application/mappers/FilterMapper'

export class ListTableRecords {
  private readTableRecord: ReadTableRecord

  constructor(private tableRepository: TableRepository) {
    this.readTableRecord = new ReadTableRecord(tableRepository)
  }

  async execute(table: string, filters?: FilterDto[]): Promise<Record[]> {
    const records = await this.tableRepository.list(
      table,
      filters?.map((filter) => mapDtoToFilter(filter))
    )
    for (let record of records) {
      record = await this.readTableRecord.enrichRecord(record, table)
    }
    return records
  }
}
