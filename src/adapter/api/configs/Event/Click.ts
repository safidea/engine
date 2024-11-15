import type { ClickEventConfig } from '@domain/entities/Event/Click'

export interface IClickEvent extends ClickEventConfig {
  event: 'Click'
}
