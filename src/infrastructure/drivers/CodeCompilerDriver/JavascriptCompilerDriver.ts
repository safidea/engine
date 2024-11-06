import { JavascriptRunnerDriver } from './JavascriptRunnerDriver'
import type { Driver } from '@adapter/spi/drivers/CodeCompilerSpi'
import vm from 'node:vm'

export class JavascriptCompilerDriver implements Driver {
  compile = (jsCode: string, env: { [key: string]: string }) => {
    const script = new vm.Script(`(${jsCode})({ inputData, env, table, packages })`)
    return new JavascriptRunnerDriver(script, env)
  }
}
