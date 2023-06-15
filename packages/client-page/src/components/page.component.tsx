'use client'

import { SWRConfig } from 'swr'
import { ComponentService } from 'client-component'

import type { CustomComponents } from 'client-component'
import type { ConfigInterface } from 'shared-app'

type PageComponentProps = {
  path: string
  config: ConfigInterface
  customComponents: CustomComponents
}

export default function PageComponent({ path, config, customComponents }: PageComponentProps) {
  const { components } = config.pages?.[path] ?? { components: [] }
  const componentService = new ComponentService({
    customComponents,
    config,
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
