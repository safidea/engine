import type { WaitForTextEventConfig } from '@domain/entities/Event/WaitForText'

export interface IWaitForTextEvent extends WaitForTextEventConfig {
  event: 'WaitForText'
}
