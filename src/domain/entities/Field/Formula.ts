import { Base, type BaseParams } from './base'
import type { DateTime } from './DateTime'
import type { LongText } from './LongText'
import type { Number as Number_ } from './Number'
import type { SingleLineText } from './SingleLineText'

interface Params extends BaseParams {
  formula: string
  output: Number_ | LongText | SingleLineText | DateTime
}

export class Formula extends Base {
  formula: string
  output: Number_ | LongText | SingleLineText | DateTime

  constructor(params: Params) {
    super(params)
    this.formula = params.formula
    this.output = params.output
  }
}
