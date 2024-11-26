import { CodeRunner } from './CodeRunner'
import type { ICodeRunnerSpi, CodeRunnerEntities, CodeRunnerIntegrations } from './CodeRunner'

export type CodeCompilerEntities = CodeRunnerEntities

export type CodeCompilerIntegrations = CodeRunnerIntegrations

export interface ICodeCompilerSpi {
  compile: (code: string, env: { [key: string]: string }) => ICodeRunnerSpi
}

export interface CodeCompilerConfig {
  language: 'JavaScript' | 'TypeScript'
}

export class CodeCompiler {
  constructor(
    private _spi: ICodeCompilerSpi,
    private _entities: CodeCompilerEntities,
    private _integrations: CodeCompilerIntegrations
  ) {}

  compile = (code: string, env: { [key: string]: string }): CodeRunner => {
    const codeRunner = this._spi.compile(code, env)
    return new CodeRunner(codeRunner, this._entities, this._integrations)
  }
}
