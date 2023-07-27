import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { mapDtoToRecord } from '@application/mappers/RecordMapper'
import { List } from '@domain/entities/components/List'

export class RenderPageList {
  constructor(private pageRepository: PageRepository) {}

  execute(list: List): () => JSX.Element {
    const UI = list.renderUI()
    const getRecords = this.pageRepository.getTableRecords(list.table, {
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
