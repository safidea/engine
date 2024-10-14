import type { Driver } from '@adapter/spi/JavascriptRunnerSpi'
import type { Modules } from '@domain/services/JavascriptRunner'
import vm from 'node:vm'
import xml2js from 'xml2js'
import * as dateFns from 'date-fns'

const parser = new xml2js.Parser({
  trim: true,
  explicitArray: false,
})

// TODO: refactor in anoter Driver
const services = {
  converter: {
    xmlToJson: async (xml: string): Promise<object> => parser.parseStringPromise(xml),
  },
  date: {
    format: (date: Date, format: string): string => dateFns.format(date, format),
  },
}

export class JavascriptRunnerDriver implements Driver {
  constructor(private _script: vm.Script) {}

  run = async (inputData: object, modules: Modules) => {
    const { table } = modules
    const context = vm.createContext({
      fetch: global.fetch,
      Error: global.Error,
      Buffer: global.Buffer,
      Date: global.Date,
      Array: global.Array,
      Number: global.Number,
      setTimeout: setTimeout,
      console: console,
      inputData,
      table,
      services,
    })
    return this._script.runInContext(context)
  }
}
