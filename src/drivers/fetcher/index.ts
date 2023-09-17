import { NativeFetcher } from './NativeFetcher'

export type FetcherDrivers = 'native'
export type FetcherDriverOptions = {
  domain: string
}

export function getFetcherDriver(drive: FetcherDrivers = 'native', options: FetcherDriverOptions) {
  switch (drive) {
    case 'native':
      return new NativeFetcher(options)
    default:
      throw new Error(`Fetcher driver '${drive}' not found`)
  }
}
