import type {
  IQontoSpi,
  QontoConfig,
  QontoCreateClient,
  QontoClient,
} from '@domain/integrations/Qonto'

export interface IQontoIntegration {
  getConfig: () => QontoConfig
  createClient: (client: QontoCreateClient) => Promise<QontoClient>
}

export class QontoSpi implements IQontoSpi {
  constructor(private _integration: IQontoIntegration) {}

  getConfig = () => {
    return this._integration.getConfig()
  }

  createClient = async (client: QontoCreateClient) => {
    return this._integration.createClient(client)
  }
}
