import { IServerSpi } from '../../../../domain/spi/IServerSpi'
import { ServerStateAdapters, ServerState } from './ServerState'
import { InstancedState } from './InstancedState'

export class ServerSpi implements IServerSpi {
  private state: ServerState

  constructor(adapters: ServerStateAdapters) {
    this.state = new InstancedState(adapters)
  }

  get port(): number {
    return this.state.port
  }

  public config(config: unknown): ServerSpi {
    this.state = this.state.config(config)
    return this
  }

  public async start(): Promise<ServerSpi> {
    this.state = await this.state.start()
    return this
  }

  public async stop(): Promise<ServerSpi> {
    this.state = await this.state.stop()
    return this
  }
}
