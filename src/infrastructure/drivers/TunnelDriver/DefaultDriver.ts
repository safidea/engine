import type { ITunnelDriver } from '@adapter/spi/drivers/TunnelSpi'

export class DefaultDriver implements ITunnelDriver {
  start = async (port: number): Promise<string> => {
    return `http://localhost:${port}`
  }

  stop = async (): Promise<void> => {
    return
  }
}
