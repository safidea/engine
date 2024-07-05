import type { Params, Spi } from '@domain/services/Theme'

export interface Driver {
  params: Params
  build: () => Promise<string>
}

export class ThemeSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  build = async () => {
    return this.driver.build()
  }
}
