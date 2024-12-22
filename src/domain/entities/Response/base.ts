export interface BaseResponseProps {
  url?: string
  body?: string | Buffer
  headers?: { [key: string]: string }
  status?: number
}

export class BaseResponse {
  url: string
  body: string | Buffer
  headers: { [key: string]: string }
  status: number

  constructor(props?: BaseResponseProps) {
    this.url = props?.url || ''
    this.body = props?.body || ''
    this.headers = props?.headers || {}
    this.status = props?.status || 200
  }
}
