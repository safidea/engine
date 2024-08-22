import { JavascriptRunner } from './JavascriptRunner'
import type { Spi as CodeRunnerSpi, Entities } from './JavascriptRunner'

export interface Spi {
  compile: (code: string) => CodeRunnerSpi
}

export class JavascriptCompiler {
  constructor(
    private _spi: Spi,
    private _entities: Entities
  ) {}

  compile = (code: string): JavascriptRunner => {
    const codeRunner = this._spi.compile(code)
    return new JavascriptRunner(codeRunner, this._entities)
  }
}
