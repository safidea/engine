import { IFetcherAdapter, FetchState } from '@adapter/spi/fetcher/IFetcherAdapter'
import { useState, useEffect } from 'react'

export class NativeFetcher implements IFetcherAdapter {
  private readonly _name = 'native'

  constructor(private _url?: string) {}

  setUrl(url: string) {
    this._url = url
  }

  get url(): string {
    return this._url || ''
  }

  get name(): string {
    return this._name
  }

  getFetch(): (path: string, options?: RequestInit) => Promise<Response> {
    const url = this._url
    return (path, options) => fetch(url + path, options)
  }

  getUseFetch(): <T>(path: string, options?: RequestInit) => FetchState<T> {
    const url = this._url
    return function useFetch<T>(path: string, options?: RequestInit) {
      const [state, setState] = useState<FetchState<T>>({
        data: undefined,
        error: undefined,
        isLoading: true,
      })

      useEffect(() => {
        fetch(url + path, options)
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
