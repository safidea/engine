import type { Params, Spi } from '@domain/services/Theme'

export interface Driver {
  params: Params
  build: (htmlContents: string[], fontsCss: string[]) => Promise<string>
}

export class ThemeSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  build = async (htmlContents: string[], fontsCss: string[]) => {
    return this.driver.build(htmlContents, fontsCss)
  }
}
