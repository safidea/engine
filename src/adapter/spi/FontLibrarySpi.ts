import type { Params, Spi } from '@domain/services/FontLibrary'

export interface Driver {
  params: Params
  loadCss: (name: string) => Promise<string>
}

export class FontLibrarySpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  loadCss = async (name: string) => {
    return this.driver.loadCss(name)
  }
}
