export interface Spi {
  generate: (length: number, chars: string) => string
}

export class IdGenerator {
  private alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  constructor(private _spi: Spi) {}

  forRecord = () => {
    return this._spi.generate(24, this.alphabet)
  }

  forFile = () => {
    return this._spi.generate(24, this.alphabet)
  }

  forEmail = () => {
    return this._spi.generate(24, this.alphabet)
  }

  forComponent = () => {
    return this._spi.generate(12, this.alphabet)
  }

  forListener = () => {
    return this._spi.generate(12, this.alphabet)
  }

  forPath = () => {
    return this._spi.generate(8, this.alphabet)
  }

  forBrowser = () => {
    return this._spi.generate(8, this.alphabet)
  }
}
