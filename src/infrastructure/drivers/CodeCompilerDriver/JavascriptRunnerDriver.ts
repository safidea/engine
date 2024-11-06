import type { Driver } from '@adapter/spi/drivers/CodeRunnerSpi'
import type { CodeContext, Modules } from '@domain/services/CodeRunner'
import vm from 'node:vm'

// Packages
import xml2js from 'xml2js'
import * as dateFns from 'date-fns'
import googleapis from 'googleapis'
import Airtable from 'airtable'
import axios from 'axios'
import https from 'https'
import crypto from 'crypto'

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
      Boolean: global.Boolean,
      Math: global.Math,
      URLSearchParams: global.URLSearchParams,
      setTimeout: setTimeout,
      console: console,
    }
    const codeContext: CodeContext<object> = {
      inputData,
      env: this._env,
      table,
      packages: {
        xml2js,
        dateFns,
        googleapis,
        Airtable,
        axios,
        https,
        crypto,
      },
    }
    const context = vm.createContext({
      ...globalContext,
      ...codeContext,
    })
    return this._script.runInContext(context)
  }
}
