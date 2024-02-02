export interface IdGeneratorSpi {
  generate: (length: number, chars: string) => string
}

export class IdGenerator {
  constructor(private spi: IdGeneratorSpi) {}

  forRecord() {
    return this.spi.generate(24, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
  }
}
