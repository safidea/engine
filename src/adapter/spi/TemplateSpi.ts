import type { Spi } from '@domain/services/Template'

export interface Driver {
  fill: (data: Record<string, unknown>) => string
}

export class TemplateSpi implements Spi {
  constructor(private driver: Driver) {}

  fill = (data: Record<string, unknown>): string => {
    return this.driver.fill(data)
  }
}
