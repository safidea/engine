import { CodeRunner } from './CodeRunner'
import type { Spi as CodeRunnerSpi, Entities as CodeRunnerEntities } from './CodeRunner'

export type Entities = CodeRunnerEntities

export interface Spi {
  compile: (code: string, env: { [key: string]: string }) => CodeRunnerSpi
}

export interface Config {
  language: 'JavaScript' | 'TypeScript'
}

export class CodeCompiler {
  constructor(
    private _spi: Spi,
    private _entities: Entities
  ) {}

  compile = (code: string, env: { [key: string]: string }): CodeRunner => {
    const codeRunner = this._spi.compile(code, env)
    return new CodeRunner(codeRunner, this._entities)
  }
}
