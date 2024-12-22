import type { AttributeExpect } from './Attribute'
import type { EmailExpect } from './Email'
import type { EqualExpect } from './Equal'
import type { ExistExpect } from './Exist'
import type { InputTextExpect } from './InputText'
import type { RecordExpect } from './Record'
import type { TextExpect } from './Text'
import type { TitleExpect } from './Title'
import type { UrlExpect } from './Url'

export type Expect =
  | InputTextExpect
  | RecordExpect
  | TextExpect
  | TitleExpect
  | AttributeExpect
  | EmailExpect
  | UrlExpect
  | EqualExpect
  | ExistExpect
