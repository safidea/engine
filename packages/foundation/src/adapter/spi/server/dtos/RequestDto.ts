export interface RequestQueryDto {
  [key: string]: string
}

export interface RequestDto {
  method: string
  path: string
  body?: unknown
  params?: {
    [key: string]: string
  }
  query?: RequestQueryDto
}
