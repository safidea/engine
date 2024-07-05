import type { Name } from '@domain/libraries/Font'

export interface Spi {
  load: (name: Name) => Promise<string>
}

export class FontLibrary {
  constructor(private spi: Spi) {}

  load = async (name: Name): Promise<string> => {
    return this.spi.load(name)
  }
}
