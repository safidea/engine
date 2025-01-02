import type { ICodeRunnerDriver } from '@adapter/spi/drivers/CodeRunnerSpi'
import type {
  CodeRunnerContext,
  CodeRunnerContextIntegrations,
  CodeRunnerContextPackages,
  CodeRunnerContextServices,
} from '@domain/services/CodeRunner'
import vm from 'node:vm'

// Packages
import xml2js from 'xml2js'
import * as dateFns from 'date-fns'
import googleapis from 'googleapis'
import Airtable from 'airtable'
import axios from 'axios'
import https from 'https'
import crypto from 'crypto'
import lodash from 'lodash'

export const packages: CodeRunnerContextPackages = {
  xml2js,
  dateFns,
  googleapis,
  Airtable,
  axios,
  https,
  crypto,
  lodash,
}

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

export class JavascriptRunnerDriver implements ICodeRunnerDriver {
  constructor(
    private _script: vm.Script,
    private _env: {
      [key: string]: string
    }
  ) {}

  run = async (
    inputData: object,
    services: CodeRunnerContextServices,
    integrations: CodeRunnerContextIntegrations
  ) => {
    const codeContext: CodeRunnerContext<object> = {
      inputData,
      env: this._env,
      services,
      integrations,
      packages,
    }
    const context = vm.createContext({
      ...globalContext,
      ...codeContext,
    })
    return this._script.runInContext(context)
  }
}
