import type { Name } from '@domain/libraries/Font'
import type { Spi } from '@domain/services/FontLibrary'

export interface Driver {
  load: (name: Name) => Promise<string>
}

export class FontLibrarySpi implements Spi {
  constructor(private driver: Driver) {}

  load = async (name: Name) => {
    return this.driver.load(name)
  }
}
