import React from 'react'
import { List } from '@domain/entities/page/components/List'
import { FetcherGatewayAbstract } from '@application/gateways/FetcherGatewayAbstract'

export class RenderPageList {
  constructor(private fetcherGateway: FetcherGatewayAbstract) {}

  async execute(list: List): Promise<() => JSX.Element> {
    const UI = list.renderUI()
    const useSyncRecords = this.fetcherGateway.getSyncRecordsHook([{ table: list.table }])
    return function ListComponent() {
      const { tables } = useSyncRecords()
      const records = tables[list.table] ?? []
      return <UI records={records} />
    }
  }
}
