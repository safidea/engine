import type { Context } from '../Automation/Context'

export interface Params {
  name: string
}

export interface Interface {
  init: () => Promise<void>
  execute(context: Context): Promise<void>
}

export class Base {
  name: string

  constructor(params: Params) {
    this.name = params.name
  }

  init = async () => {}
}
