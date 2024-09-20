import type { Config } from '@domain/entities/Event/WaitForAutomation'

export interface WaitForAutomation extends Config {
  event: 'WaitForAutomation'
}
