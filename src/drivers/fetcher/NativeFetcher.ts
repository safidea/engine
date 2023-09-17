import { FetchState, IFetcherDriver } from '@adapters/services/fetcher/IFetcherDriver'
import { useState, useEffect } from 'react'
import { FetcherDriverOptions } from '.'

export class NativeFetcher implements IFetcherDriver {
  public readonly name = 'native'
  public readonly domain: string

  constructor(options: FetcherDriverOptions) {
    this.domain = options.domain
  }

  getFetch(): (path: string, options?: RequestInit) => Promise<Response> {
    const domain = this.domain
    return (path, options) => fetch(domain + path, options)
  }

  getUseFetch(): <T>(path: string, options?: RequestInit) => FetchState<T> {
    const domain = this.domain
    return function useFetch<T>(path: string, options?: RequestInit) {
      const [state, setState] = useState<FetchState<T>>({
        data: undefined,
        error: undefined,
        isLoading: true,
      })

      useEffect(() => {
        fetch(domain + path, options)
          .then((response) => {
            if (response.ok) {
              return response.json() as Promise<T>
            } else {
              throw new Error('Error: ' + response.statusText)
            }
          })
          .then((data) => {
            setState({
              data: data,
              error: undefined,
              isLoading: false,
            })
          })
          .catch((error) => {
            setState({
              data: undefined,
              error: error,
              isLoading: false,
            })
          })
      }, [path, options])

      return state
    }
  }
}
