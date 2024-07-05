import type { SansSerif, Serif } from '@domain/libraries/Font'

export interface Config {
  fontFamily?: {
    sans?: SansSerif[]
    serif?: Serif[]
  }
}

export interface Params extends Config {}

export interface Spi {
  params: Params
  build: () => Promise<string>
}

export class Theme {
  constructor(private spi: Spi) {}

  fonts(): (Serif | SansSerif)[] {
    const { sans = [], serif = [] } = this.spi.params.fontFamily || {}
    return [...sans, ...serif]
  }

  async build() {
    return this.spi.build()
  }
}
