import type { Spi } from '@domain/services/Theme'

export interface Driver {
  build: () => Promise<void>
}

export class ThemeSpi implements Spi {
  constructor(private driver: Driver) {}

  build = async () => {
    await this.driver.build()
  }
}
