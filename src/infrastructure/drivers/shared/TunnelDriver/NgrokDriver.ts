import type { ITunnelDriver } from '@adapter/spi/drivers/TunnelSpi'
import type { INgrokIntegration } from '@adapter/spi/integrations/NgrokSpi'
import type { NgrokConfig } from '@domain/integrations/Ngrok'
import { NgrokIntegration } from '@infrastructure/integrations/NgrokIntegration'

export class NgrokDriver implements ITunnelDriver {
  private _ngrok: INgrokIntegration

  constructor(config?: NgrokConfig) {
    this._ngrok = new NgrokIntegration(config)
  }

  start = async (port: number): Promise<string> => {
    return this._ngrok.start(port)
  }

  stop = async (): Promise<void> => {
    return this._ngrok.stop()
  }
}
