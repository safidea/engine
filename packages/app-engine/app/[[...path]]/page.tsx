import NextAppClient from '@app/client'
import NextAppServer from '@app/server'
import { notFound } from 'next/navigation'

import type { ConfigInterface } from 'shared-app'

export const generateStaticParams = NextAppServer.generateStaticParams

export const generateMetadata = NextAppServer.generateMetadata

export default function Page({ params }) {
  const config = NextAppServer.getConfigFromPath() as ConfigInterface
  const RenderedPage = NextAppClient.nextPageHandler(params, config)
  if (!RenderedPage) notFound()
  return <RenderedPage />
}
