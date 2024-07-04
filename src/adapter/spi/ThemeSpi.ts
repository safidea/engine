import type { Spi } from '@domain/services/Theme'

export interface Driver {
  build: () => Promise<string>
}

export class ThemeSpi implements Spi {
  constructor(private driver: Driver) {}

  build = async () => {
    return this.driver.build()
  }
}
