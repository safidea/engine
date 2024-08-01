import { Base, type Params as BaseParams, type Interface } from './base'
import type { Context } from '../Automation/Context'

interface Params extends BaseParams {
  input: { [key: string]: string | number | boolean }
  code: string
}

export class RunJavascriptCode extends Base implements Interface {
  constructor(private _params: Params) {
    super(_params)
  }

  execute = async (_context: Context) => {}
}
