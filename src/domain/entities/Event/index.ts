import type { ClickEvent } from './Click'
import type { ClickInEmailEvent } from './ClickInEmail'
import type { FillEvent } from './Fill'
import type { OpenEvent } from './Open'
import type { PostEvent } from './Post'
import type { WaitForAutomationEvent } from './WaitForAutomation'
import type { WaitForTextEvent } from './WaitForText'

export type Event =
  | OpenEvent
  | FillEvent
  | PostEvent
  | ClickEvent
  | WaitForTextEvent
  | WaitForAutomationEvent
  | ClickInEmailEvent
