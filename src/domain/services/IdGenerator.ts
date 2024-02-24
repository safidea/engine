export interface Spi {
  generate: (length: number, chars: string) => string
}

export class IdGenerator {
  constructor(private spi: Spi) {}

  forRecord = () => {
    return this.spi.generate(24, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
  }

  forForm = () => {
    return this.spi.generate(12, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
  }

  forListener = () => {
    return this.spi.generate(12, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
  }
}
