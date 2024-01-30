import type { IIdGeneratorMapper } from '@domain/services/idGenerator/IIdGeneratorMapper'
import type { IIdGeneratorDriver } from './IIdGeneratorDriver'

export class IdGeneratorMapper implements IIdGeneratorMapper {
  constructor(private driver: IIdGeneratorDriver) {}

  generate = (length: number, chars: string): string => this.driver.generate(length, chars)
}
