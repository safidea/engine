export interface IdGeneratorSPI {
  generate: (length: number, chars: string) => string
}

export class IdGenerator {
  constructor(private spi: IdGeneratorSPI) {}

  forRecord() {
    return this.spi.generate(24, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
  }
}
