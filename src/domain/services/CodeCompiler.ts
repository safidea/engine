import { CodeRunner } from './CodeRunner'
import type { Spi as CodeRunnerSpi } from './CodeRunner'

export interface Spi {
  compile: (code: string) => CodeRunnerSpi
}

export class CodeCompiler {
  constructor(private _spi: Spi) {}

  compile = (code: string): CodeRunner => {
    const codeRunner = this._spi.compile(code)
    return new CodeRunner(codeRunner)
  }
}
