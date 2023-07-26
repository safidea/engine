import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { List } from '@domain/entities/components/List'

export class RenderPageList {
  constructor(private pageRepository: PageRepository) {}

  execute(list: List): () => JSX.Element {
    const UI = list.renderUI()
    const { useTable } = this.pageRepository
    return function Component() {
      const { records, error, isLoading } = useTable(list.table)
      return <UI records={records} error={error} isLoading={isLoading} />
    }
  }
}
