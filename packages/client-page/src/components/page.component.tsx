'use client'

import { SWRConfig } from 'swr'
import { ComponentService } from 'client-component'

import type { PageInterface } from 'shared-page'
import type { ServerProviderComponentsInterface } from 'shared-common'

export type PageComponentProps = {
  page: PageInterface
  serverProviderComponents: ServerProviderComponentsInterface
}

export default function PageComponent({ page, serverProviderComponents }: PageComponentProps) {
  const { components } = page
  const componentService = new ComponentService({
    serverProviderComponents,
  })
  const Children = componentService.renderChildren(components)
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (url, init) => fetch(url, init).then((res) => res.json()),
      }}
    >
      <Children />
    </SWRConfig>
  )
}
