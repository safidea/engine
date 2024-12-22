import type { WaitForAutomationEventConfig } from '@domain/entities/Event/WaitForAutomation'

export interface IWaitForAutomationEvent extends WaitForAutomationEventConfig {
  event: 'WaitForAutomation'
}
