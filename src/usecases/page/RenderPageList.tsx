import React from 'react'
import { List } from '@entities/app/page/components/List'
import { IFetcherSpi } from '@entities/spi/IFetcherSpi'

export class RenderPageList {
  constructor(private fetcherSpi: IFetcherSpi) {}

  async execute(list: List): Promise<() => JSX.Element> {
    const UI = list.renderUI()
    const useSyncRecords = this.fetcherSpi.getSyncRecordsHook([{ table: list.table }])
    return function ListComponent() {
      const { tables } = useSyncRecords()
      const records = tables[list.table] ?? []
      return <UI records={records} />
    }
  }
}
