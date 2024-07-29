import { Base, type BaseParams } from './base'

interface Params extends BaseParams {
  options: string[]
}

export class SingleSelect extends Base {
  options: string[]

  constructor(params: Params) {
    super(params)
    this.options = params.options
  }
}
