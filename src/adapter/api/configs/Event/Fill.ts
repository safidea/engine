import type { Config } from '@domain/entities/Event/Fill'

export interface Fill extends Config {
  event: 'Fill'
}
