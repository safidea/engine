export interface BaseProps {
  body?: string
  headers?: { [key: string]: string }
  status?: number
}

export class Base {
  body: string
  headers: { [key: string]: string }
  status: number

  constructor(props?: BaseProps) {
    this.body = props?.body || ''
    this.headers = props?.headers || {}
    this.status = props?.status || 200
  }
}
