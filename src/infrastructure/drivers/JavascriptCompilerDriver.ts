import { JavascriptRunnerDriver } from './JavascriptRunnerDriver'
import type { Driver } from '@adapter/spi/JavascriptCompilerSpi'
import vm from 'node:vm'

export class JavascriptCompilerDriver implements Driver {
  constructor() {}

  compile = (code: string, env: { [key: string]: string }) => {
    const script = new vm.Script(`(${code})({ inputData, env, table, packages })`)
    return new JavascriptRunnerDriver(script, env)
  }
}
