import type { FetcherProviderInterface, FetcherProviderOptionsInterface } from 'shared-app'
import type { DatabaseDataType } from 'shared-database'

// Use built-in next fetch API to make HTTP requests

class FetchProvider implements FetcherProviderInterface {
  public get = async (url: string, options: FetcherProviderOptionsInterface = {}) => {
    return fetch(url, options).then((res) => res.json())
  }

  public post = async (
    url: string,
    data: DatabaseDataType | DatabaseDataType[],
    options: FetcherProviderOptionsInterface = {}
  ) => {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    }).then((res) => res.json())
  }

  public patch = async (
    url: string,
    data: DatabaseDataType | DatabaseDataType[],
    options: FetcherProviderOptionsInterface = {}
  ) => {
    return fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    }).then((res) => res.json())
  }

  public put = async (
    url: string,
    data: DatabaseDataType | DatabaseDataType[],
    options: FetcherProviderOptionsInterface = {}
  ) => {
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    }).then((res) => res.json())
  }

  public delete = async (url: string, options: FetcherProviderOptionsInterface = {}) => {
    return fetch(url, {
      method: 'DELETE',
      ...options,
    }).then((res) => res.json())
  }
}

export default FetchProvider
