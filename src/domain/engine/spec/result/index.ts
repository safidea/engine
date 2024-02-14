import type { Attribute } from './Attribute'
import type { Email } from './Email'
import type { InputText } from './InputText'
import type { Record } from './Record'
import type { Text } from './Text'
import type { Title } from './Title'

export type Result = InputText | Record | Text | Title | Attribute | Email
