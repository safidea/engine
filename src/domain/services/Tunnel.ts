import type { NgrokConfig } from '@domain/integrations/Ngrok'

export interface TunnelNgrokConfig extends NgrokConfig {
  integration: 'Ngrok'
}

export type TunnelConfig = TunnelNgrokConfig

export interface ITunnelSpi {
  start: (port: number) => Promise<string>
  stop: () => Promise<void>
}

export class Tunnel {
  constructor(private _spi: ITunnelSpi) {}

  start = async (port: number | string): Promise<string> => {
    return this._spi.start(Number(port))
  }

  stop = async (): Promise<void> => {
    return this._spi.stop()
  }
}
