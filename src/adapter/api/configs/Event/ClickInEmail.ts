import type { ClickInEmailEventConfig } from '@domain/entities/Event/ClickInEmail'

export interface IClickInEmailEvent extends ClickInEmailEventConfig {
  event: 'ClickInEmail'
}
