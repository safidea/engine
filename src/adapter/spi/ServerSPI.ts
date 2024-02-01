import type { ServerSPI as IServerSPI } from '@domain/services/Server'

export interface ServerDriver {
  start(): Promise<string>
  stop(): Promise<void>
}

export class ServerSPI implements IServerSPI {
  constructor(private driver: ServerDriver) {}

  start = async () => {
    await this.driver.start()
  }

  stop = async () => {
    await this.driver.stop()
  }
}
