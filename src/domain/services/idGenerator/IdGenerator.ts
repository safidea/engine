import type { IIdGeneratorMapper } from './IIdGeneratorMapper'

export class IdGenerator {
  constructor(private mapper: IIdGeneratorMapper) {}

  forDatabase(): string {
    return this.mapper.generate(
      24,
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    )
  }
}
