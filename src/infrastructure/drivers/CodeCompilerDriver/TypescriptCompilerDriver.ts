import { JavascriptCompilerDriver } from './JavascriptCompilerDriver'
import type { ICodeCompilerDriver } from '@adapter/spi/drivers/CodeCompilerSpi'
import ts from 'typescript'

export class TypescriptCompilerDriver implements ICodeCompilerDriver {
  compile = (tsCode: string, env: { [key: string]: string }) => {
    const { outputText: jsCode } = ts.transpileModule(tsCode, {
      compilerOptions: {
        target: ts.ScriptTarget.ESNext,
        noEmitHelpers: true,
        importHelpers: false,
      },
    })
    return new JavascriptCompilerDriver().compile(jsCode, env)
  }
}
