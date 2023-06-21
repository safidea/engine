import NextAppClient from '@providers/client/next.client.provider'
import NextAppServer from '@providers/server/next.server.provider'
import { getPathFromParams } from '@utils/next.utils'

import type { OptionsType } from '@utils/next.utils'

export const generateStaticParams = () => NextAppServer.generateStaticParams()

export const generateMetadata = (options: OptionsType) => NextAppServer.generateMetadata(options)

export default function Page({ params }) {
  const config = NextAppServer.getConfig()
  const path = getPathFromParams(params)
  return <NextAppClient path={path} config={config} />
}
