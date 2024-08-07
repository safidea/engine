import type { Driver } from '@adapter/spi/CodeRunnerSpi'
import type { Modules } from '@domain/services/CodeRunner'
import vm from 'node:vm'

export class JavascriptRunnerDriver implements Driver {
  constructor(private _script: vm.Script) {}

  run = async (inputData: object, modules: Modules) => {
    const { table } = modules
    const context = vm.createContext({
      setTimeout: setTimeout,
      console: console,
      inputData,
      table,
    })
    return this._script.runInContext(context)
  }
}
