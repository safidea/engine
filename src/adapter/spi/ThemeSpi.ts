import type { Params, Spi } from '@domain/services/Theme'

export interface Driver {
  params: Params
  build: (fontsCss: string[]) => Promise<string>
}

export class ThemeSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  build = async (fontsCss: string[]) => {
    return this.driver.build(fontsCss)
  }
}
