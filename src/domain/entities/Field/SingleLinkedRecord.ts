import { Base, type BaseParams } from './base'

interface Params extends BaseParams {
  table: string
}

export class SingleLinkedRecord extends Base {
  table: string

  constructor(params: Params) {
    super(params)
    this.table = params.table
  }
}
