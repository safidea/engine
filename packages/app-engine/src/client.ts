import { PageService } from 'client-page'

import type { CustomComponents } from 'client-component'
import type { ConfigInterface, FetcherProviderInterface } from 'shared-app'

type AppClientProps = {
  customComponents: CustomComponents
  fetcherProvider: FetcherProviderInterface
}

class AppClient {
  private pageService: PageService

  constructor({ customComponents, fetcherProvider }: AppClientProps) {
    this.pageService = new PageService({ customComponents, fetcherProvider })
  }

  pageHandler(path: string, config: ConfigInterface) {
    return this.pageService.render(path, config)
  }
}

export default AppClient
