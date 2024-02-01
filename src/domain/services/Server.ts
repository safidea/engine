export interface ServerSPI {
  start: () => Promise<void>
  stop: () => Promise<void>
}

export class Server {
  constructor(private spi: ServerSPI) {}

  start = async () => {
    await this.spi.start()
  }

  stop = async () => {
    await this.spi.stop()
  }
}
