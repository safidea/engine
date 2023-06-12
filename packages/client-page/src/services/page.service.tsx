import { ComponentService } from 'client-component'
import { SWRConfig } from 'swr'

import type { CustomComponents } from 'client-component'
import type { ConfigInterface, FetcherProviderInterface } from 'shared-app'

type PageServiceProps = {
  customComponents: CustomComponents
  fetcherProvider: FetcherProviderInterface
}

class PageService {
  private customComponents: CustomComponents
  private fetcherProvider: FetcherProviderInterface

  constructor({ customComponents, fetcherProvider }: PageServiceProps) {
    this.customComponents = customComponents
    this.fetcherProvider = fetcherProvider
  }

  public render(path: string, config: ConfigInterface) {
    const { components } = config.pages?.[path] ?? { components: [] }
    const componentService = new ComponentService({
      customComponents: this.customComponents,
      fetcherProvider: this.fetcherProvider,
      config,
    })
    const Page = componentService.renderChildren(components)
    return (
      <SWRConfig
        value={{
          refreshInterval: 3000,
          fetcher: (resource, init) => this.fetcherProvider.get(resource, init),
        }}
      >
        <Page />
      </SWRConfig>
    )
  }
}

export default PageService
