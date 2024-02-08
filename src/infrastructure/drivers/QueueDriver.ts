import type { Driver } from '@adapter/spi/QueueSpi'
import type { Params } from '@domain/services/Queue'

export class QueueDriver implements Driver {
  constructor(public params: Params) {}

  getJob = async (id: string): Promise<string> => {
    throw new Error(id)
  }

  waitForJob = async (id: string): Promise<string> => {
    throw new Error(id)
  }
}
