import type { Config as Filter } from '@domain/entities/Filter'

export interface ClickInEmail {
  event: 'ClickInEmail'
  mailbox: string
  find: Filter[]
  text: string
}
