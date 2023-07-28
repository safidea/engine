import { PageGateway } from '@adapter/spi/gateways/PageGateway'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'
import { List } from '@domain/entities/page/components/List'

export class RenderPageList {
  constructor(private PageGateway: PageGateway) {}

  execute(list: List): () => JSX.Element {
    const UI = list.renderUI()
    const getRecords = this.PageGateway.getTableRecords(list.table, {
      groupBy: list.groupBy,
      sortBy: list.sortBy,
    })
    return function Component() {
      const { records, error, isLoading } = getRecords()
      return (
        <UI
          records={records.map((recordDto) => mapDtoToRecord(list.table, recordDto))}
          error={error?.message}
          isLoading={isLoading}
        />
      )
    }
  }
}
