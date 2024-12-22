import type { OpenEventConfig } from '@domain/entities/Event/Open'

export interface IOpenEvent extends OpenEventConfig {
  event: 'Open'
}
