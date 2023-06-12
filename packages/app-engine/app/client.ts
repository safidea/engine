import Image from 'next/image'
import Link from 'next/link'
import AppClient from '../src/client'
import FetchProvider from '../src/providers/fetch.provider'
import { getPathFromParams } from './shared'

import type { ParamsType } from './shared'
import type { ConfigInterface } from 'shared-app'

class NextAppClient extends AppClient {
  nextPageHandler(params: ParamsType, config: ConfigInterface) {
    const path = getPathFromParams(params)
    return super.pageHandler(path, config)
  }
}

export default new NextAppClient({
  customComponents: { Image, Link },
  fetcherProvider: new FetchProvider(),
})
