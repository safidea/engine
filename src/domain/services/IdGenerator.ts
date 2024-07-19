export interface Spi {
  generate: (length: number, chars: string) => string
}

export class IdGenerator {
  private alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  constructor(private spi: Spi) {}

  forRecord = () => {
    return this.spi.generate(24, this.alphabet)
  }

  forComponent = () => {
    return this.spi.generate(12, this.alphabet)
  }

  forListener = () => {
    return this.spi.generate(12, this.alphabet)
  }

  forPath = () => {
    return this.spi.generate(8, this.alphabet)
  }

  forBrowser = () => {
    return this.spi.generate(8, this.alphabet)
  }
}
