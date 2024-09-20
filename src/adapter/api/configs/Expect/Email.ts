import type { Config as Filter } from '@domain/entities/Filter'
import type { Config } from '@domain/entities/Expect/Email'

export interface Email extends Config {
  expect: 'Email'
  find: Filter[]
}
