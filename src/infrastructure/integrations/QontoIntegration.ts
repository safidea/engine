import type { IQontoIntegration } from '@adapter/spi/integrations/QontoSpi'
import type { QontoClient, QontoConfig, QontoCreateClient } from '@domain/integrations/Qonto'
import axios, { type AxiosInstance } from 'axios'

export class QontoIntegration implements IQontoIntegration {
  private _instance: AxiosInstance | undefined

  constructor(private _config?: QontoConfig) {}

  config = (): QontoConfig => {
    if (!this._config) {
      throw new Error('Qonto config not set')
    }
    return this._config
  }

  createClient = async (client: QontoCreateClient): Promise<QontoClient | undefined> => {
    const response = await this._qontoAPI()
      .post('/clients', client)
      .catch((error) => {
        return error.response
      })
    if (response.status === 200) {
      return response.data.client
    } else {
      console.error(
        `Error fetching data from Qonto ${this.config().environment} API:`,
        JSON.stringify(response.data, null, 2)
      )
      return
    }
  }

  private _qontoAPI = (): AxiosInstance => {
    if (!this._instance) {
      const config = this.config()
      const headers = {
        Authorization: `${config.organisationSlug}:${config.secretKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Qonto-Staging-Token': 'whRkdAsXqJVcMKpAx270MBFLobKxLrB0CohD0z/5w8U=',
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
