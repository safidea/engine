import { OrmGateway } from '@adapter/spi/gateways/OrmGateway'
import { ReadTableRecord } from './ReadTableRecord'
import { FilterDto } from '@application/dtos/table/FilterDto'
import { mapDtoToFilter } from '@application/mappers/table/FilterMapper'
import { mapRecordToDto } from '@application/mappers/table/RecordMapper'
import { RecordDto } from '@application/dtos/table/RecordDto'
import { AppGateway } from '@adapter/spi/gateways/AppGateway'

export class ListTableRecords {
  private readTableRecord: ReadTableRecord

  constructor(
    private ormGateway: OrmGateway,
    appGateway: AppGateway
  ) {
    this.readTableRecord = new ReadTableRecord(ormGateway, appGateway)
  }

  async execute(table: string, filters: FilterDto[] = []): Promise<RecordDto[]> {
    const records = await this.ormGateway.list(
      table,
      filters.map((filter) => mapDtoToFilter(filter))
    )
    const promises = []
    for (const record of records) {
      promises.push(this.readTableRecord.enrichRecord(mapRecordToDto(record), table))
    }
    return Promise.all(promises)
  }
}
