import type { Filter } from '../../filter'

export interface Email {
  mailbox: string
  find: Filter[]
}
