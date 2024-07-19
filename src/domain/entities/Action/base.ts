import type { Context } from '../Automation/Context'

export interface Params {
  name: string
}

export interface Interface {
  execute(context: Context): Promise<void>
}

export class Base {
  name: string

  constructor(params: Params) {
    this.name = params.name
  }
}
