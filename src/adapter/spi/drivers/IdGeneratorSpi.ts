import type { IIdGeneratorSpi } from '@domain/services/IdGenerator'

export interface IIdGeneratorDriver {
  generate(length: number, chars: string): string
}

export class IdGeneratorSpi implements IIdGeneratorSpi {
  constructor(private _driver: IIdGeneratorDriver) {}

  generate = (length: number, chars: string): string => this._driver.generate(length, chars)
}
