import { ComponentService } from 'client-component'

import type { PageInterface } from 'shared-page'
import type { AppProviderComponentsInterface } from 'shared-common'

export type PageComponentProps = {
  page: PageInterface
  appProviderComponents: AppProviderComponentsInterface
  pathParams: { [key: string]: string }
}

export default function PageComponent({
  page,
  appProviderComponents,
  pathParams,
}: PageComponentProps) {
  // TODO: throw a proper error message if page doesn't exist
  const { components } = page
  const componentService = new ComponentService({
    appProviderComponents,
  })
  const Children = componentService.renderChildren(components)
  const { Page } = appProviderComponents ?? {}
  if (!Page) return <Children pathParams={pathParams} />
  return (
    <Page>
      <Children pathParams={pathParams} />
    </Page>
  )
}
