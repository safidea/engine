import { TableGateway } from '@adapter/spi/gateways/TableGateway'
import { ReadTableRecord } from './ReadTableRecord'
import { FilterDto } from '@application/dtos/table/FilterDto'
import { mapDtoToFilter } from '@application/mappers/table/FilterMapper'
import { mapRecordToDto } from '@application/mappers/table/RecordMapper'
import { RecordDto } from '@application/dtos/table/RecordDto'

export class ListTableRecords {
  private readTableRecord: ReadTableRecord

  constructor(private TableGateway: TableGateway) {
    this.readTableRecord = new ReadTableRecord(TableGateway)
  }

  async execute(table: string, filters?: FilterDto[]): Promise<RecordDto[]> {
    const records = await this.TableGateway.list(
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
