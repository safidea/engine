import type { Spi } from '@domain/services/JavascriptCompiler'
import { type Driver as JavascriptRunnerDriver, JavascriptRunnerSpi } from './JavascriptRunnerSpi'

export interface Driver {
  compile: (code: string) => JavascriptRunnerDriver
}

export class JavascriptCompilerSpi implements Spi {
  constructor(private _driver: Driver) {}

  compile = (code: string) => {
    const driver = this._driver.compile(code)
    return new JavascriptRunnerSpi(driver)
  }
}
