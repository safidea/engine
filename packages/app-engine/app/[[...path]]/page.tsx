import { notFound } from 'next/navigation'
import { PageService as ClientPageService } from 'client-page'
import { PageRoute as ServerPageRoute } from 'server-page'
import { ConfigUtils } from 'server-common'

import type { NextParamsType } from 'server-page'
import type { ConfigInterface } from 'shared-config'

type PropsType = {
  params: NextParamsType
}

export async function generateStaticParams() {
  return ServerPageRoute.generateStaticPaths()
}

export async function generateMetadata({ params }: PropsType) {
  return ServerPageRoute.generateMetadata(params)
}

export default function Page({ params }: PropsType) {
  const components = ServerPageRoute.generateComponents(params)
  const config = ConfigUtils.get() as ConfigInterface
  if (!components) notFound()
  const RenderedPage = ClientPageService.render(components, config)
  return <RenderedPage />
}
