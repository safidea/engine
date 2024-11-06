import type { Spi } from '@domain/services/CodeCompiler'
import { type Driver as CodeRunnerDriver, CodeRunnerSpi } from './CodeRunnerSpi'

export interface Driver {
  compile: (code: string, env: { [key: string]: string }) => CodeRunnerDriver
}

export class CodeCompilerSpi implements Spi {
  constructor(private _driver: Driver) {}

  compile = (code: string, env: { [key: string]: string }) => {
    const driver = this._driver.compile(code, env)
    return new CodeRunnerSpi(driver)
  }
}
