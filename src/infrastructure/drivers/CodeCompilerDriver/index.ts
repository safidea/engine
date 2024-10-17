import type { Driver } from '@adapter/spi/CodeCompilerSpi'
import type { Config } from '@domain/services/CodeCompiler'
import { JavascriptCompilerDriver } from './JavascriptCompilerDriver'

export class CodeCompilerDriver implements Driver {
  private _codeCompiler: JavascriptCompilerDriver

  constructor(config: Config) {
    const { language } = config
    switch (language) {
      case 'JavaScript':
        this._codeCompiler = new JavascriptCompilerDriver()
        break
      default:
        throw new Error('Invalid language')
    }
  }

  compile = (code: string, env: { [key: string]: string }) => {
    return this._codeCompiler.compile(code, env)
  }
}
