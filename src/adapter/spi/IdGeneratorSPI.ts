import type { IdGeneratorSPI as IIdGeneratorSPI } from '@domain/services/IdGenerator'

export interface IdGeneratorDriver {
  generate(length: number, chars: string): string
}

export class IdGeneratorSPI implements IIdGeneratorSPI {
  constructor(private driver: IdGeneratorDriver) {}

  generate = (length: number, chars: string): string => this.driver.generate(length, chars)
}
