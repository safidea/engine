import type { DateTime } from './DateTime'
import type { Email } from './Email'
import type { Formula } from './Formula'
import type { LongText } from './LongText'
import type { Number as Number_ } from './Number'
import type { SingleLineText } from './SingleLineText'
import type { SingleLinkedRecord } from './SingleLinkedRecord'
import type { SingleSelect } from './SingleSelect'

export type Field =
  | Email
  | SingleLineText
  | DateTime
  | LongText
  | Number_
  | Formula
  | SingleSelect
  | SingleLinkedRecord
