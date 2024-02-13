import { BaseWithPage, type BaseParams } from './base'

interface Params extends BaseParams {
  waitForAutomation: string
}

export class WaitForAutomation extends BaseWithPage {
  constructor(private params: Params) {
    super()
  }

  execute = async () => {}
}
