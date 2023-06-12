import type { FetcherProviderInterface, FetcherProviderOptionsInterface } from 'shared-app'
import type { DatabaseDataType } from 'shared-database'

// Use built-in next fetch API to make HTTP requests

class FetchProvider implements FetcherProviderInterface {
  public async get(url: string, options: FetcherProviderOptionsInterface = {}) {
    return fetch(url, options).then((res) => res.json())
  }

  public async post(
    url: string,
    data: DatabaseDataType | DatabaseDataType[],
    options: FetcherProviderOptionsInterface = {}
  ) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    }).then((res) => res.json())
  }

  public async patch(
    url: string,
    data: DatabaseDataType | DatabaseDataType[],
    options: FetcherProviderOptionsInterface = {}
  ) {
    return fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    }).then((res) => res.json())
  }

  public async put(
    url: string,
    data: DatabaseDataType | DatabaseDataType[],
    options: FetcherProviderOptionsInterface = {}
  ) {
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    }).then((res) => res.json())
  }

  public async delete(url: string, options: FetcherProviderOptionsInterface = {}) {
    return fetch(url, {
      method: 'DELETE',
      ...options,
    }).then((res) => res.json())
  }
}

export default FetchProvider
