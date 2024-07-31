import { Base, type BaseParams } from './base'
import type { DateTime } from './DateTime'
import type { LongText } from './LongText'
import type { MultipleLinkedRecord } from './MultipleLinkedRecord'
import type { Number as Number_ } from './Number'
import type { SingleLineText } from './SingleLineText'

interface Params extends BaseParams {
  formula: string
  multipleLinkedRecord: MultipleLinkedRecord
  linkedRecordField: string
  output: Number_ | LongText | SingleLineText | DateTime
}

export class Rollup extends Base {
  formula: string
  multipleLinkedRecord: MultipleLinkedRecord
  linkedRecordField: string
  output: Number_ | LongText | SingleLineText | DateTime

  constructor(params: Params) {
    super(params)
    this.formula = params.formula
    this.multipleLinkedRecord = params.multipleLinkedRecord
    this.linkedRecordField = params.linkedRecordField
    this.output = params.output
  }

  get table() {
    return this.multipleLinkedRecord.table
  }
}
