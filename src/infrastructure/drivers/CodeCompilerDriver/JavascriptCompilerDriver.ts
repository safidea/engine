import vm from 'node:vm'
import { JavascriptRunnerDriver } from './JavascriptRunnerDriver'
import type { Driver } from '@adapter/spi/CodeCompilerSpi'

export class JavascriptCompilerDriver implements Driver {
  constructor() {}

  compile = (code: string) => {
    const script = new vm.Script(`(async () => {
      ${code}
    })()`)
    return new JavascriptRunnerDriver(script)
  }
}
