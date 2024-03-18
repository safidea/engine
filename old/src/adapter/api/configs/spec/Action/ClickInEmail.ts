import type { Filter } from '../../filter'

export interface ClickInEmail {
  mailbox: string
  find: Filter[]
  click: string
}
