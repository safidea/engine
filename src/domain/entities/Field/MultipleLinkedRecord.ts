import { Base, type BaseParams } from './base'

interface Params extends BaseParams {
  table: string
}

export class MultipleLinkedRecord extends Base {
  table: string

  constructor(params: Params) {
    super(params)
    this.table = params.table
  }
}
