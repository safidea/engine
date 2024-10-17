import { JavascriptCompilerDriver } from './JavascriptCompilerDriver'
import type { Driver } from '@adapter/spi/CodeCompilerSpi'
import ts from 'typescript'

export class TypescriptCompilerDriver implements Driver {
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
