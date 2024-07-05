import type { Spi } from '@domain/services/FontLibrary'

export interface Driver {
  load: (name: string) => Promise<string>
}

export class FontLibrarySpi implements Spi {
  constructor(private driver: Driver) {}

  load = async (name: string) => {
    return this.driver.load(name)
  }
}
