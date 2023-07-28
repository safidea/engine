import { hydrateRoot } from 'react-dom/client'
import { PageController } from '@adapter/api/controllers/PageController'
import { PageDto } from '@application/dtos/page/PageDto'
import { mapDtoToPage } from '@application/mappers/table/PageMapper'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'

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
      config: PageDto
    }
  }
}

;(async () => {
  const { uiName, fetcherName, domain, config } = window.__FOUNDATION_DATA__
  const page = mapDtoToPage(config, selectUI(uiName))
  const controller = new PageController(selectFetcher(fetcherName, domain))
  const Page = await controller.render(page)
  const container = document.getElementById('root')
  if (!container) throw new Error('Root element not found')
  hydrateRoot(container, Page)
})()
