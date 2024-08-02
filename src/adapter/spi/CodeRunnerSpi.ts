import type { Spi } from '@domain/services/CodeRunner'

export interface Driver {
  run: (data: object) => Promise<object>
}

export class CodeRunnerSpi implements Spi {
  constructor(private _driver: Driver) {}

  run = (data: object) => {
    return this._driver.run(data)
  }
}
