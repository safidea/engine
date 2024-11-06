import type { Spi } from '@domain/services/IdGenerator'

export interface Driver {
  generate(length: number, chars: string): string
}

export class IdGeneratorSpi implements Spi {
  constructor(private _driver: Driver) {}

  generate = (length: number, chars: string): string => this._driver.generate(length, chars)
}
