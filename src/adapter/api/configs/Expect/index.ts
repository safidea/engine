import type { IAttributeExpect } from './Attribute'
import type { IEmailExpect } from './Email'
import type { IEqualExpect } from './Equal'
import type { IExistExpect } from './Exist'
import type { IInputTextExpect } from './InputText'
import type { IRecordExpect } from './Record'
import type { ITextExpect } from './Text'
import type { ITitleExpect } from './Title'
import type { IUrlExpect } from './Url'

export type IExpect =
  | IRecordExpect
  | ITextExpect
  | ITitleExpect
  | IInputTextExpect
  | IAttributeExpect
  | IEmailExpect
  | IUrlExpect
  | IEqualExpect
  | IExistExpect
