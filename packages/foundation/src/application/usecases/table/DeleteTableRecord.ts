import { TableGateway } from '@adapter/spi/gateways/TableGateway'
import { RecordDto } from '@application/dtos/table/RecordDto'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'

export class DeleteTableRecord {
  constructor(private TableGateway: TableGateway) {}

  async execute(table: string, id: string): Promise<void> {
    const recordDto: RecordDto = {
      deleted_time: new Date().toISOString(),
    }
    await this.TableGateway.update(table, mapDtoToRecord(table, { ...recordDto, id }), id)
  }
}
