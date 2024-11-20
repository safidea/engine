import type {
  IQontoSpi,
  QontoConfig,
  QontoCreateClient,
  QontoClient,
} from '@domain/integrations/Qonto'

export interface IQontoIntegration {
  config: () => QontoConfig
  createClient: (client: QontoCreateClient) => Promise<QontoClient>
}

export class QontoSpi implements IQontoSpi {
  constructor(private _integration: IQontoIntegration) {}

  config = () => {
    return this._integration.config()
  }

  createClient = async (client: QontoCreateClient) => {
    return this._integration.createClient(client)
  }
}
