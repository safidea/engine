import type { Driver } from '@adapter/spi/JavascriptRunnerSpi'
import type { Modules } from '@domain/services/JavascriptRunner'
import vm from 'node:vm'

export class JavascriptRunnerDriver implements Driver {
  constructor(private _script: vm.Script) {}

  run = async (inputData: object, modules: Modules) => {
    const { table } = modules
    const context = vm.createContext({
      fetch: global.fetch,
      Error: global.Error,
      Buffer: global.Buffer,
      setTimeout: setTimeout,
      console: console,
      inputData,
      table,
    })
    return this._script.runInContext(context)
  }
}
