import type { Spi } from '@domain/services/JavascriptCompiler'
import { type Driver as JavascriptRunnerDriver, JavascriptRunnerSpi } from './JavascriptRunnerSpi'

export interface Driver {
  compile: (code: string, env: { [key: string]: string }) => JavascriptRunnerDriver
}

export class JavascriptCompilerSpi implements Spi {
  constructor(private _driver: Driver) {}

  compile = (code: string, env: { [key: string]: string }) => {
    const driver = this._driver.compile(code, env)
    return new JavascriptRunnerSpi(driver)
  }
}
