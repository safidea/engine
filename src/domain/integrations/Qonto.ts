export interface QontoSandboxConfig extends Omit<QontoProductionConfig, 'environment'> {
  environment: 'sandbox'
  stagingToken: string
}

export interface QontoProductionConfig {
  environment: 'production'
  organisationSlug: string
  secretKey: string
}

export type QontoConfig = QontoSandboxConfig | QontoProductionConfig

export interface IQontoSpi {
  getConfig: () => QontoConfig
  createClient: (client: QontoCreateClient) => Promise<QontoClient>
}

export class Qonto {
  constructor(private _spi: IQontoSpi) {}

  getConfig = (): QontoConfig => {
    return this._spi.getConfig()
  }

  createClient = async (client: QontoCreateClient): Promise<QontoClient> => {
    return this._spi.createClient(client)
  }
}

interface QontoBillingAddress {
  street_address: string
  city: string
  zip_code: string
  province_code: string
  country_code: string
}

interface QontoDeliveryAddress {
  street_address: string
  city: string
  zip_code: string
  province_code: string
  country_code: string
}

export interface QontoClient {
  id: string
  email?: string
  vat_number?: string
  name?: string
  first_name?: string
  last_name?: string
  type: string
  tax_identification_number?: string
  address: string
  city: string
  zip_code: string
  country_code: string
  billing_address?: QontoBillingAddress
  delivery_address?: QontoDeliveryAddress
  created_at: string
  locale: string
}

export type QontoCreateClient = Omit<QontoClient, 'id' | 'created_at'> & {
  currency: string
}
