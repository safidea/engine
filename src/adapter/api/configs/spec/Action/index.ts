import type { Click } from './Click'
import type { Fill } from './Fill'
import type { Open } from './Open'
import type { Post } from './Post'
import type { WaitForText } from './WaitForText'

export type Action = Fill | Open | Post | Click | WaitForText
