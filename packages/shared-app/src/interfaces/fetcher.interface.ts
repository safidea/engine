import type { DatabaseDataType } from 'shared-database'
import type { ResponseJsonType } from './response.interface'

export interface FetcherProviderOptionsInterface {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  headers?: { [key: string]: string }
  body?: string
}

export interface FetcherProviderInterface {
  get(url: string, options: FetcherProviderOptionsInterface): Promise<ResponseJsonType>
  post(
    url: string,
    data: DatabaseDataType | DatabaseDataType[],
    options?: FetcherProviderOptionsInterface
  ): Promise<ResponseJsonType>
  patch(
    url: string,
    data: DatabaseDataType | DatabaseDataType[],
    options?: FetcherProviderOptionsInterface
  ): Promise<ResponseJsonType>
  put(
    url: string,
    data: DatabaseDataType | DatabaseDataType[],
    options?: FetcherProviderOptionsInterface
  ): Promise<ResponseJsonType>
  delete(url: string, options: FetcherProviderOptionsInterface): Promise<ResponseJsonType>
}

export interface FetcherProviderConstructorInterface {
  new (): FetcherProviderInterface
}
