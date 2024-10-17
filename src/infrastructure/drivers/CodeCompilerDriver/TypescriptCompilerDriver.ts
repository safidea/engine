import { JavascriptRunnerDriver } from './JavascriptRunnerDriver'
import type { Driver } from '@adapter/spi/CodeCompilerSpi'
import vm from 'node:vm'
import ts from 'typescript'

export class TypescriptCompilerDriver implements Driver {
  constructor() {}

  compile = (tsCode: string, env: { [key: string]: string }) => {
    const { outputText: jsCode } = ts.transpileModule(tsCode, {
      compilerOptions: {
        target: ts.ScriptTarget.ESNext,
        noEmitHelpers: true,
        importHelpers: false,
      },
    })
    const script = new vm.Script(`(${jsCode})({ inputData, env, table, packages })`)
    return new JavascriptRunnerDriver(script, env)
  }
}
