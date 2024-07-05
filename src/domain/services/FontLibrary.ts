export interface Spi {
  load: (name: string) => Promise<string>
}

export class FontLibrary {
  constructor(private spi: Spi) {}

  load = async (name: string): Promise<string> => {
    return this.spi.load(name)
  }
}
