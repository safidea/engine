import type { Driver } from '@adapter/spi/CodeCompilerSpi'
import { JavascriptCompilerDriver } from './JavascriptCompilerDriver'

export class CodeCompilerDriver implements Driver {
  private _compiler: Driver

  constructor(public language = 'javascript') {
    if (language === 'javascript') {
      this._compiler = new JavascriptCompilerDriver()
    } else {
      throw new Error(`Unsupported language: ${language}`)
    }
  }

  compile = (code: string) => {
    return this._compiler.compile(code)
  }
}
