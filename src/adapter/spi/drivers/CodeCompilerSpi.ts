import type { ICodeCompilerSpi } from '@domain/services/CodeCompiler'
import { type ICodeRunnerDriver, CodeRunnerSpi } from './CodeRunnerSpi'

export interface ICodeCompilerDriver {
  compile: (code: string, env: { [key: string]: string }) => ICodeRunnerDriver
}

export class CodeCompilerSpi implements ICodeCompilerSpi {
  constructor(private _driver: ICodeCompilerDriver) {}

  compile = (code: string, env: { [key: string]: string }) => {
    const driver = this._driver.compile(code, env)
    return new CodeRunnerSpi(driver)
  }
}
