import type { ITunnelSpi } from '@domain/services/Tunnel'
import type { NgrokIntegration } from '@infrastructure/integrations/NgrokIntegration'

export interface TunnelDriverIntegrations {
  ngrok: NgrokIntegration
}

export interface ITunnelDriver {
  start: (port: number) => Promise<string>
  stop: () => Promise<void>
}

export class TunnelSpi implements ITunnelSpi {
  constructor(private _driver: ITunnelDriver) {}

  start = async (port: number): Promise<string> => {
    return this._driver.start(port)
  }

  stop = async (): Promise<void> => {
    return this._driver.stop()
  }
}
