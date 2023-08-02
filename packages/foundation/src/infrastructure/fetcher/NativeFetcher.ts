import { IFetcherGateway, FetchState } from '@domain/gateways/IFetcherGateway'
import { useState, useEffect } from 'react'

export function NativeFetcher(domain: string): IFetcherGateway {
  return {
    fetch: (url: string, options?: RequestInit) => fetch(domain + url, options),
    useFetch: <T>(url: string, options?: RequestInit) => {
      const [state, setState] = useState<FetchState<T>>({
        data: undefined,
        error: undefined,
        isLoading: false,
      })

      useEffect(() => {
        setState((currentState) => ({ ...currentState, isLoading: true }))
        fetch(domain + url, options)
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
      }, [url, options])

      return state
    },
  }
}
