import type { Base } from './base'
import type { DateTime } from './DateTime'
import type { LongText } from './LongText'
import type { Number as Number_ } from './Number'
import type { SingleLineText } from './SingleLineText'

export interface Formula extends Base {
  field: 'Formula'
  formula: string
  output: Omit<SingleLineText | LongText | Number_ | DateTime, 'name'>
}
