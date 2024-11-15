import type { ICodeRunnerSpi, CodeRunnerModules } from '@domain/services/CodeRunner'

export interface ICodeRunnerDriver {
  run: (data: object, modules: CodeRunnerModules) => Promise<object>
}

export class CodeRunnerSpi implements ICodeRunnerSpi {
  constructor(private _driver: ICodeRunnerDriver) {}

  run = (data: object, modules: CodeRunnerModules) => {
    return this._driver.run(data, modules)
  }
}
