import type { ITunnelDriver } from '@adapter/spi/drivers/TunnelSpi'
import type { TunnelConfig } from '@domain/services/Tunnel'
import { NgrokDriver } from './NgrokDriver'
import { DefaultDriver } from './DefaultDriver'

export class TunnelDriver implements ITunnelDriver {
  private _tunnel: DefaultDriver | NgrokDriver

  constructor(config?: TunnelConfig) {
    if (!config) {
      this._tunnel = new DefaultDriver()
      return
    }
    const { integration } = config
    switch (integration) {
      case 'Ngrok':
        this._tunnel = new NgrokDriver(config)
        break
    }
  }

  start: (port: number) => Promise<string> = async (port) => {
    return this._tunnel.start(port)
  }

  stop: () => Promise<void> = async () => {
    return this._tunnel.stop()
  }
}
