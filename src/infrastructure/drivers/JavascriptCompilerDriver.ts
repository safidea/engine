import { JavascriptRunnerDriver } from './JavascriptRunnerDriver'
import type { Driver } from '@adapter/spi/JavascriptCompilerSpi'
import vm from 'node:vm'

export class JavascriptCompilerDriver implements Driver {
  constructor() {}

  compile = (code: string) => {
    const script = new vm.Script(`(async () => {
      ${code}
    })()`)
    return new JavascriptRunnerDriver(script)
  }
}
