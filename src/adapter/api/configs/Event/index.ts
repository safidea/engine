import type { IClickEvent } from './Click'
import type { IClickInEmailEvent } from './ClickInEmail'
import type { IFillEvent } from './Fill'
import type { IOpenEvent } from './Open'
import type { IPostEvent } from './Post'
import type { IWaitForAutomationEvent } from './WaitForAutomation'
import type { IWaitForTextEvent } from './WaitForText'

export type IEvent =
  | IFillEvent
  | IOpenEvent
  | IPostEvent
  | IClickEvent
  | IWaitForTextEvent
  | IWaitForAutomationEvent
  | IClickInEmailEvent
