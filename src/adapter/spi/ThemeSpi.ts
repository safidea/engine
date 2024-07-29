import type { Spi } from '@domain/services/Theme'

export interface Driver {
  build: (htmlContents: string[], fontsCss: string[]) => Promise<string>
}

export class ThemeSpi implements Spi {
  constructor(private _driver: Driver) {}

  build = async (htmlContents: string[], fontsCss: string[]) => {
    return this._driver.build(htmlContents, fontsCss)
  }
}
