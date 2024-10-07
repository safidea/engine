import type { Driver } from '@adapter/spi/JavascriptRunnerSpi'
import type { Modules } from '@domain/services/JavascriptRunner'
import vm from 'node:vm'
import xml2js from 'xml2js'

const parser = new xml2js.Parser({
  trim: true,
  explicitArray: false,
})

// TODO: refactor in anoter Driver
const formater = {
  xmlToJs: async (xml: string) => parser.parseStringPromise(xml),
}

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
      formater,
    })
    return this._script.runInContext(context)
  }
}
