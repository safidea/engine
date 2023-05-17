export interface RequestInterface {
  locals: {
    [key: string]: unknown
  }
  query: {
    [key: string]: string
  }
  body?: {
    [key: string]: unknown
  }
}
