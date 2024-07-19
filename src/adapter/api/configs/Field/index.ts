import type { DateTime } from './DateTime'
import type { Email } from './Email'
import type { LongText } from './LongText'
import type { Number as Number_ } from './Number'
import type { SingleLineText } from './SingleLineText'

export type Field = Email | SingleLineText | DateTime | LongText | Number_
