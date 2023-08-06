import React from 'react'
import { List } from '@domain/entities/page/components/List'
import { FetcherGatewayAbstract } from '@application/gateways/FetcherGatewayAbstract'

export class RenderPageList {
  constructor(private fetcherGateway: FetcherGatewayAbstract) {}

  async execute(list: List): Promise<() => JSX.Element> {
    const UI = list.renderUI()
    const getRecordsHook = this.fetcherGateway.getTableRecordsHook(list.table)
    return function ListComponent() {
      const { records } = getRecordsHook()
      return <UI records={records} />
    }
  }
}
