export interface Params {
  code: string
  feature: string
  spec: string
  expected?: string | number | boolean | object
  received?: string | number | boolean | object
}

export class TestError {
  constructor(private params: Params) {}

  get code() {
    return this.params.code
  }

  get feature() {
    return this.params.feature
  }

  get spec() {
    return this.params.spec
  }

  get expected() {
    return this.params.expected
  }

  get received() {
    return this.params.received
  }
}
