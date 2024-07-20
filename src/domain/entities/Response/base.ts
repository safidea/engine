export interface BaseProps {
  url?: string
  body?: string | Buffer
  headers?: { [key: string]: string }
  status?: number
}

export class Base {
  url: string
  body: string | Buffer
  headers: { [key: string]: string }
  status: number

  constructor(props?: BaseProps) {
    this.url = props?.url || ''
    this.body = props?.body || ''
    this.headers = props?.headers || {}
    this.status = props?.status || 200
  }
}
