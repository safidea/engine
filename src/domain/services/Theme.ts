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

  encodedFonts = (): string[] => {
    const { sans = [], serif = [] } = this.spi.params.fontFamily || {}
    return [...sans, ...serif].map((f) => encodeURIComponent(f))
  }

  build = async () => {
    return this.spi.build()
  }
}
