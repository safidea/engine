import type { Driver } from '@adapter/spi/JavascriptRunnerSpi'
import type { FunctionContext, Modules } from '@domain/services/JavascriptRunner'
import vm from 'node:vm'

// Packages
import xml2js from 'xml2js'
import * as dateFns from 'date-fns'
import googleapis from 'googleapis'
import Airtable from 'airtable'

export class JavascriptRunnerDriver implements Driver {
  constructor(
    private _script: vm.Script,
    private _env: {
      [key: string]: string
    }
  ) {}

  run = async (inputData: object, modules: Modules) => {
    const { table } = modules
    const globalContext = {
      fetch: global.fetch,
      Error: global.Error,
      Buffer: global.Buffer,
      Date: global.Date,
      Array: global.Array,
      Number: global.Number,
      setTimeout: setTimeout,
      console: console,
    }
    const functionContext: FunctionContext = {
      inputData,
      env: this._env,
      table,
      packages: {
        xml2js,
        dateFns,
        googleapis,
        Airtable,
      },
    }
    const context = vm.createContext({
      ...globalContext,
      ...functionContext,
    })
    return this._script.runInContext(context)
  }
}
