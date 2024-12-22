import { JavascriptRunnerDriver } from './JavascriptRunnerDriver'
import type { ICodeCompilerDriver } from '@adapter/spi/drivers/CodeCompilerSpi'
import vm from 'node:vm'

export class JavascriptCompilerDriver implements ICodeCompilerDriver {
  compile = (jsCode: string, env: { [key: string]: string }) => {
    const script = new vm.Script(
      `(${jsCode})({ inputData, env, services, integrations, packages })`
    )
    return new JavascriptRunnerDriver(script, env)
  }
}
