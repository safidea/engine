export interface ResponseDto {
  body: string
  status: number
  headers: {
    [key: string]: string
  }
}
