import React from 'react'
import { PageGateway } from '@adapter/spi/gateways/PageGateway'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'
import { List } from '@domain/entities/page/components/List'

export class RenderPageList {
  constructor(private pageGateway: PageGateway) {}

  execute(list: List): () => JSX.Element {
    const UI = list.renderUI()
    const getRecords = this.pageGateway.getTableRecords(list.table, {
      groupBy: list.groupBy,
      sortBy: list.sortBy,
    })
    return function Component() {
      const { records } = getRecords()
      return <UI records={records.map((recordDto) => mapDtoToRecord(list.table, recordDto))} />
    }
  }
}
