import type { INgrokIntegration } from '@adapter/spi/integrations/NgrokSpi'
import type { NgrokConfig } from '@domain/integrations/Ngrok'
import ngrok from '@ngrok/ngrok'

export class NgrokIntegration implements INgrokIntegration {
  constructor(private _config?: NgrokConfig) {}

  getConfig = (): NgrokConfig => {
    if (!this._config) {
      throw new Error('Ngrok config not set')
    }
    return this._config
  }

  start = async (port: number): Promise<string> => {
    const listener = await ngrok.connect({
      addr: port,
      authtoken: this.getConfig().authToken,
    })
    const url = listener.url()
    if (!url) {
      throw new Error('No URL returned from ngrok')
    }
    return url
  }

  stop = async (): Promise<void> => {
    await ngrok.kill()
  }
}
