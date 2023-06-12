import { DatabaseRowType } from 'shared-database'

export interface ResponseErrorInterface {
  error: string
  details?: string
}

export type ResponseJsonType = DatabaseRowType | DatabaseRowType[] | ResponseErrorInterface

export interface ResponseInterface {
  status?: number
  json: ResponseJsonType
}
