import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { ReadTableRecord } from './ReadTableRecord'
import { FilterDto } from '@application/dtos/FilterDto'
import { mapDtoToFilter } from '@application/mappers/FilterMapper'
import { mapRecordToDto } from '@application/mappers/RecordMapper'
import { RecordDto } from '@application/dtos/RecordDto'

export class ListTableRecords {
  private readTableRecord: ReadTableRecord

  constructor(private tableRepository: TableRepository) {
    this.readTableRecord = new ReadTableRecord(tableRepository)
  }

  async execute(table: string, filters?: FilterDto[]): Promise<RecordDto[]> {
    const records = await this.tableRepository.list(
      table,
      filters?.map((filter) => mapDtoToFilter(filter))
    )
    const promises = []
    for (const record of records) {
      promises.push(this.readTableRecord.enrichRecord(mapRecordToDto(record), table))
    }
    return Promise.all(promises)
  }
}
