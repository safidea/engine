import type { IQontoIntegration } from '@adapter/spi/integrations/QontoSpi'
import type { QontoClient, QontoConfig, QontoCreateClient } from '@domain/integrations/Qonto'
import axios, { type AxiosInstance } from 'axios'

export class QontoIntegration implements IQontoIntegration {
  private _instance?: AxiosInstance

  constructor(private _config?: QontoConfig) {}

  getConfig = (): QontoConfig => {
    if (!this._config) {
      throw new Error('Qonto config not set')
    }
    return this._config
  }

  createClient = async (client: QontoCreateClient): Promise<QontoClient> => {
    const response = await this._api()
      .post('/clients', client)
      .catch((error) => {
        return error.response
      })
    if (response.status === 200) {
      return response.data.client
    } else {
      throw new Error(
        `Error fetching data from Qonto ${this.getConfig().environment} API: ` +
          JSON.stringify(response.data, null, 2)
      )
    }
  }

  private _api = (): AxiosInstance => {
    if (!this._instance) {
      const config = this.getConfig()
      const headers = {
        Authorization: `${config.organisationSlug}:${config.secretKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
      switch (config.environment) {
        case 'sandbox':
          this._instance = axios.create({
            baseURL: 'https://thirdparty-sandbox.staging.qonto.co/v2',
            headers: {
              ...headers,
              'X-Qonto-Staging-Token': config.stagingToken,
            },
          })
          break
        case 'production':
          this._instance = axios.create({
            baseURL: 'https://thirdparty.qonto.com/v2',
            headers,
          })
          break
      }
    }
    return this._instance
  }
}
