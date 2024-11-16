import type { IPappersIntegration } from '@adapter/spi/integrations/PappersSpi'
import type { PappersConfig, PappersEntreprise } from '@domain/integrations/Pappers'
import axios from 'axios'

export class PappersIntegration implements IPappersIntegration {
  private _apiKey: string | undefined

  constructor(private _config?: PappersConfig) {}

  config = () => {
    if (!this._apiKey) {
      if (!this._config) {
        throw new Error('Pappers config not set')
      }
      this._apiKey = this._config.apiKey
    }
    return this._apiKey
  }

  getCompany = async (siret: string): Promise<PappersEntreprise | undefined> => {
    const apiKey = this.config()
    const url = 'https://api.pappers.fr/v2/entreprise'
    try {
      const response = await axios.get<PappersEntreprise>(url, {
        params: {
          siret,
        },
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      })
      if (response.data) {
        return response.data
      } else {
        console.error('No data returned for the given SIRET.')
        return
      }
    } catch (error) {
      console.error('Error fetching data from Pappers API:', error)
      return
    }
  }
}
