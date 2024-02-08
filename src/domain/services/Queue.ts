export interface Params {
  url: string
  database: 'sqlite' | 'postgres'
}

export interface Spi {
  params: Params
  getJob: (id: string) => Promise<string>
}

export class Queue {
  constructor(private spi: Spi) {}

  getJob = async (id: string): Promise<string> => {
    return this.spi.getJob(id)
  }
}
