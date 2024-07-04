export interface Config {
  fontFamily?: {
    sans?: string[]
  }
}

export interface Params extends Config {}

export interface Spi {
  build: () => Promise<string>
}

export class Theme {
  constructor(private spi: Spi) {}

  async build() {
    return this.spi.build()
  }
}
