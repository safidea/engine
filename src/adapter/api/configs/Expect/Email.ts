import type { Filter } from '../Filter'

export interface Email {
  expect: 'Email'
  mailbox: string
  find: Filter[]
}
