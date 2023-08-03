import { OrmGateway } from '@adapter/spi/gateways/OrmGateway'
import { EnrichedRecordDto } from '@application/dtos/table/RecordDto'
import { ListTableRecords } from './ListTableRecords'
import { ReadTableRecord } from './ReadTableRecord'
import { App } from '@domain/entities/App'
import { MultipleLinkedRecords } from '@domain/entities/table/fields/MultipleLinkedRecords'

export class ReadAndEnrichTableRecord {
  private readTableRecord: ReadTableRecord
  private listTableRecord: ListTableRecords

  constructor(
    ormGateway: OrmGateway,
    private app: App
  ) {
    this.readTableRecord = new ReadTableRecord(ormGateway, app)
    this.listTableRecord = new ListTableRecords(ormGateway, app)
  }

  async execute(table: string, id: string): Promise<EnrichedRecordDto> {
    const recordDto = await this.readTableRecord.execute(table, id)
    const fields = this.app.getTableFields(table)
    const enrichedRecordDto: EnrichedRecordDto = {}
    for (const field of fields) {
      if (field instanceof MultipleLinkedRecords) {
        const recordsIds = recordDto[field.name]
        if (!recordsIds) continue
        const linkedRecords = await this.listTableRecord.execute(field.table, [
          { field: 'id', operator: 'is_any_of', value: recordsIds },
        ])
        enrichedRecordDto[field.name] = linkedRecords
      } else {
        enrichedRecordDto[field.name] = recordDto[field.name]
      }
    }
    return enrichedRecordDto
  }
}
