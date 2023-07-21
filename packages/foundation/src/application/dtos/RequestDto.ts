import { FilterDto } from './FilterDto'

export interface RequestDto {
  method: string
  path: string
  body?: {
    [key: string]: string | number | boolean
  }
  params?: {
    [key: string]: string
  }
  query?: {
    [key: string]: string
  }
}

export interface RequestWithLocalDto extends RequestDto {
  local: {
    filters?: FilterDto[]
  }
}
