import { TableGateway } from '@adapter/spi/gateways/TableGateway'
import { RecordToCreateDto } from '@application/dtos/table/RecordDto'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'
import { CreateTableRecord } from './CreateTableRecord'

export class CreateManyTableRecord {
  private createTableRecord: CreateTableRecord

  constructor(private tableGateway: TableGateway) {
    this.createTableRecord = new CreateTableRecord(tableGateway)
  }

  async execute(table: string, records: RecordToCreateDto[]): Promise<string[]> {
    const recordsDtos = await Promise.all(
      records.map((record) => this.createTableRecord.buildRecordDto(table, record))
    )
    return this.tableGateway.createMany(
      table,
      recordsDtos.map((record) => mapDtoToRecord(table, record))
    )
  }
}
