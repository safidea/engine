import type { Spi, Modules } from '@domain/services/JavascriptRunner'

export interface Driver {
  run: (data: object, modules: Modules) => Promise<object>
}

export class JavascriptRunnerSpi implements Spi {
  constructor(private _driver: Driver) {}

  run = (data: object, modules: Modules) => {
    return this._driver.run(data, modules)
  }
}
