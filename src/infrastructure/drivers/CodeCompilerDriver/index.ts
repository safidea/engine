import type { ICodeCompilerDriver } from '@adapter/spi/drivers/CodeCompilerSpi'
import type { CodeCompilerConfig } from '@domain/services/CodeCompiler'
import { JavascriptCompilerDriver } from './JavascriptCompilerDriver'
import { TypescriptCompilerDriver } from './TypescriptCompilerDriver'

export class CodeCompilerDriver implements ICodeCompilerDriver {
  private _codeCompiler: JavascriptCompilerDriver | TypescriptCompilerDriver

  constructor(config: CodeCompilerConfig) {
    const { language } = config
    switch (language) {
      case 'JavaScript':
        this._codeCompiler = new JavascriptCompilerDriver()
        break
      case 'TypeScript':
        this._codeCompiler = new TypescriptCompilerDriver()
        break
      default:
        throw new Error('Invalid language')
    }
  }

  compile = (code: string, env: { [key: string]: string }) => {
    return this._codeCompiler.compile(code, env)
  }
}
