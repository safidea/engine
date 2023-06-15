import NextAppClient from '@app/client'
import NextAppServer from '@app/server'
import { getPathFromParams } from '../shared'

import type { OptionsType } from '../shared'

export const generateStaticParams = () => NextAppServer.generateStaticParams()

export const generateMetadata = (options: OptionsType) => NextAppServer.generateMetadata(options)

export default function Page({ params }) {
  const config = NextAppServer.getConfig()
  const path = getPathFromParams(params)
  return <NextAppClient path={path} config={config} />
}
