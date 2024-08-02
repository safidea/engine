import type { Config as Filter } from '@domain/entities/Filter'

export interface Email {
  expect: 'Email'
  mailbox: string
  find: Filter[]
}
