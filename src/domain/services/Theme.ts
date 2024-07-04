export interface Spi {
  build: () => Promise<void>
}

export class Theme {
  constructor(private spi: Spi) {}

  async build() {
    await this.spi.build()
  }
}
