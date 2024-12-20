import type { NgrokConfig } from '@domain/integrations/Ngrok'
import ngrok from '@ngrok/ngrok'

export class NgrokIntegration {
  constructor(private _config: NgrokConfig) {}

  getUrl = async (port: number | string): Promise<string> => {
    const listener = await ngrok.connect({
      addr: Number(port),
      authtoken: this._config.authToken,
    })
    const url = listener.url()
    if (!url) {
      throw new Error('No URL returned from ngrok')
    }
    return url
  }
}
