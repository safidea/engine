export interface Params {
  code: string
  spec: string
  expected?: string | number | boolean | object
  received?: string | number | boolean | object
}

export class TestError {
  public code: string
  public spec: string
  public expected?: string | number | boolean | object
  public received?: string | number | boolean | object

  constructor(params: Params) {
    this.code = params.code
    this.spec = params.spec
    this.expected = params.expected
    this.received = params.received
  }
}
