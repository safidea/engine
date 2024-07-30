import type { DateTime } from './DateTime'
import type { Email } from './Email'
import type { LongText } from './LongText'
import type { SingleLineText } from './SingleLineText'
import type { Number as Number_ } from './Number'
import type { Formula } from './Formula'
import type { SingleSelect } from './SingleSelect'
import type { SingleLinkedRecord } from './SingleLinkedRecord'
import type { MultipleLinkedRecord } from './MultipleLinkedRecord'

export type Field =
  | Email
  | SingleLineText
  | LongText
  | DateTime
  | Number_
  | Formula
  | SingleSelect
  | SingleLinkedRecord
  | MultipleLinkedRecord
