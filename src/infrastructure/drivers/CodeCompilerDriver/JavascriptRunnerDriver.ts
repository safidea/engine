import type { Driver } from '@adapter/spi/CodeRunnerSpi'
import vm from 'node:vm'

export class JavascriptRunnerDriver implements Driver {
  constructor(private _script: vm.Script) {}

  run = async (data: object) => {
    const context = vm.createContext({
      setTimeout: setTimeout,
      console: console,
      inputData: data,
    })
    return this._script.runInContext(context)
  }
}
