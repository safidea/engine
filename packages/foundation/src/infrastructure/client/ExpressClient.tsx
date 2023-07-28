import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { PageController } from '@adapter/api/controllers/PageController'
import { PageDto } from '@application/dtos/page/PageDto'
import { mapDtoToPage } from '@application/mappers/table/PageMapper'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { mapDtoToTable } from '@application/mappers/table/TableMapper'
import { TableDto } from '@application/dtos/table/TableDto'

function selectUI(uiName: string) {
  switch (uiName) {
    case 'unstyled':
      return UnstyledUI
    default:
      throw new Error('UI not found')
  }
}

function selectFetcher(fetcherName: string, domain: string) {
  switch (fetcherName) {
    case 'native':
      return NativeFetcher(domain)
    default:
      throw new Error('UI not found')
  }
}

declare global {
  interface Window {
    __FOUNDATION_DATA__: {
      uiName: string
      fetcherName: string
      domain: string
      pageDto: PageDto
      tablesDto: TableDto[]
    }
  }
}

;(async () => {
  const { uiName, fetcherName, domain, pageDto, tablesDto } = window.__FOUNDATION_DATA__
  const tables = tablesDto.map((tableDto: TableDto) => mapDtoToTable(tableDto))
  const page = mapDtoToPage(pageDto, selectUI(uiName), tables)
  const pageController = new PageController(selectFetcher(fetcherName, domain))
  const Page = await pageController.render(page)
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element not found')
  hydrateRoot(container, <Page />)
})()
