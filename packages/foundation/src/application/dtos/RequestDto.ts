export interface RequestDto {
  method: string
  path: string
  body?: {
    [key: string]: string | number | boolean
  }
  params?: {
    [key: string]: string
  }
}
