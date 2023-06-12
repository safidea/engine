import { DatabaseDataType } from 'shared-database'

export interface RequestInterface {
  url: string
  method: string
  params: {
    [key: string]: string
  }
  query: {
    [key: string]: string
  }
  body?: DatabaseDataType | DatabaseDataType[]
}

export interface RequestBodyInterface extends RequestInterface {
  body: DatabaseDataType
}

export interface RequestArrayBodyInterface extends RequestInterface {
  body: DatabaseDataType[]
}
