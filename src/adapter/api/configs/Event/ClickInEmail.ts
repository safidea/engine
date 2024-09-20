import type { Config } from '@domain/entities/Event/ClickInEmail'
import type { Config as FilterConfig } from '@domain/entities/Filter'

export interface ClickInEmail extends Config {
  event: 'ClickInEmail'
  find: FilterConfig[]
}
