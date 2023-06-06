import { notFound } from 'next/navigation'
import { PageService as ClientPageService } from 'client-page'
import { PageRoute as ServerPageRoute } from 'server-page'

import type { NextParamsType } from 'server-page'

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
  if (!components) notFound()
  const RenderedPage = ClientPageService.render(components)
  return <RenderedPage />
}
