import type { IIdGeneratorMapper } from '../../mappers/IIdGeneratorMapper'

export class IdGenerator {
  constructor(private mapper: IIdGeneratorMapper) {}

  forRecord() {
    return this.mapper.generate(
      24,
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    )
  }
}
