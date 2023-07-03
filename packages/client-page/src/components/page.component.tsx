import { ComponentService } from 'client-component'

import type { PageInterface } from 'shared-page'
import type { AppProviderComponentsInterface } from 'shared-common'

export type PageComponentProps = {
  page: PageInterface
  appProviderComponents: AppProviderComponentsInterface
}

export default function PageComponent({ page, appProviderComponents }: PageComponentProps) {
  const { components } = page
  const componentService = new ComponentService({
    appProviderComponents,
  })
  const Children = componentService.renderChildren(components)
  const { Page } = appProviderComponents ?? {}
  if (!Page) return <Children />
  return (
    <Page>
      <Children />
    </Page>
  )
}
