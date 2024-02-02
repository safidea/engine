import type { IdGeneratorSpi as IIdGeneratorSpi } from '@domain/services/IdGenerator'

export interface IdGeneratorDriver {
  generate(length: number, chars: string): string
}

export class IdGeneratorSpi implements IIdGeneratorSpi {
  constructor(private driver: IdGeneratorDriver) {}

  generate = (length: number, chars: string): string => this.driver.generate(length, chars)
}
