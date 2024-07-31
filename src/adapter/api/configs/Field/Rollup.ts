import type { Base } from './base'
import type { DateTime } from './DateTime'
import type { LongText } from './LongText'
import type { Number as Number_ } from './Number'
import type { SingleLineText } from './SingleLineText'

export interface Rollup extends Base {
  field: 'Rollup'
  multipleLinkedRecord: string
  linkedRecordField: string
  formula: string
  output: Omit<SingleLineText | LongText | Number_ | DateTime, 'name'>
}
