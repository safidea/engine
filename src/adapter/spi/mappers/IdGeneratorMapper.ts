import type { IIdGeneratorMapper } from 'src_OLD/domain/services/idGenerator/IIdGeneratorMapper'
import type { IIdGeneratorDriver } from '../drivers/IIdGeneratorDriver'

export class IdGeneratorMapper implements IIdGeneratorMapper {
  constructor(private driver: IIdGeneratorDriver) {}

  generate = (length: number, chars: string): string => this.driver.generate(length, chars)
}
