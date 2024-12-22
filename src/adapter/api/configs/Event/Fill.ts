import type { FillEventConfig } from '@domain/entities/Event/Fill'

export interface IFillEvent extends FillEventConfig {
  event: 'Fill'
}
