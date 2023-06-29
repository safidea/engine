'use client'

import { SWRConfig } from 'swr'
import { ComponentService } from 'client-component'

import type { PageInterface } from 'shared-page'
import type { AppProviderComponentsInterface } from 'shared-common'

export type PageComponentProps = {
  page: PageInterface
  appProviderComponents?: AppProviderComponentsInterface
}

export default function PageComponent({ page, appProviderComponents }: PageComponentProps) {
  const { components } = page
  const componentService = new ComponentService({
    appProviderComponents,
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
