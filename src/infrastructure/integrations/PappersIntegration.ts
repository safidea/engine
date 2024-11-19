import type { IPappersIntegration } from '@adapter/spi/integrations/PappersSpi'
import type { PappersConfig, PappersEntreprise } from '@domain/integrations/Pappers'
import axios, { type AxiosInstance } from 'axios'

export class PappersIntegration implements IPappersIntegration {
  private _instance: AxiosInstance | undefined

  constructor(private _config?: PappersConfig) {}

  config = (): PappersConfig => {
    if (!this._config) {
      throw new Error('Pappers config not set')
    }
    return this._config
  }

  getCompany = async (siret: string): Promise<PappersEntreprise | undefined> => {
    const response = await this._pappersAPI()
      .get('/entreprise', { params: { siret } })
      .catch((error) => {
        return error.response
      })
    if (response.status === 200) {
      if (!response.data) {
        console.error('No data returned for the given SIRET.')
        return
      }
      return response.data
    } else {
      console.error('Error fetching data from Pappers API:', response.data)
      return
    }
  }

  private _pappersAPI = (): AxiosInstance => {
    if (!this._instance) {
      const { apiKey } = this.config()
      this._instance = axios.create({
        baseURL: 'https://api.pappers.fr/v2',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      })
    }
    return this._instance
  }
}
