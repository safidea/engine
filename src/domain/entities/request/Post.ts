import { Base, type Params as BaseParams } from './base'

export interface Params extends BaseParams {
  body: unknown
}

export class Post extends Base {
  body: unknown

  constructor(params: Params) {
    super(params)
    this.body = params.body
  }
}
