import type { Params, Spi } from '@domain/services/Queue'

export interface Driver {
  params: Params
  getJob: (id: string) => Promise<string>
}

export class QueueSpi implements Spi {
  constructor(private driver: Driver) {}

  get params() {
    return this.driver.params
  }

  getJob = async (id: string): Promise<string> => {
    return this.driver.getJob(id)
  }
}
