export interface BaseParams {
  name: string
}

export class Base {
  name: string

  constructor(params: BaseParams) {
    this.name = params.name
  }
}
