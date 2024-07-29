import type { Spi } from '@domain/services/FontLibrary'

export interface Driver {
  loadCss: (name: string) => Promise<string>
}

export class FontLibrarySpi implements Spi {
  constructor(private _driver: Driver) {}

  loadCss = async (name: string) => {
    return this._driver.loadCss(name)
  }
}
