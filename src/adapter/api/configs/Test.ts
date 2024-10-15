import type { Event } from './Event'
import type { Expect } from './Expect'

// TODO: revoir la configuration pour qu'il ne puisse y avoir que 1 seul expected par test
export interface Test {
  name: string
  when: Event[]
  then: Expect[]
}
