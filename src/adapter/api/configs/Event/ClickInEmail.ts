import type { Filter } from '../Filter'

export interface ClickInEmail {
  event: 'ClickInEmail'
  mailbox: string
  find: Filter[]
  text: string
}
