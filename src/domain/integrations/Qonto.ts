interface QontoSandboxConfig extends Omit<QontoProductionConfig, 'environment'> {
  environment: 'sandbox'
  stagingToken: string
}

interface QontoProductionConfig {
  environment: 'production'
  organisationSlug: string
  secretKey: string
}

export type QontoConfig = QontoSandboxConfig | QontoProductionConfig

export interface IQontoSpi {
  config: () => QontoConfig
  createClient: (client: QontoCreateClient) => Promise<QontoClient>
}

export class Qonto {
  constructor(private _spi: IQontoSpi) {}

  config = (): QontoConfig => {
    return this._spi.config()
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

interface QontoClientBase {
  id: string
  type: string
  email?: string
  vat_number?: string
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

interface QontoClientCompany extends QontoClientBase {
  name: string
}

interface QontoClientIndividual extends QontoClientBase {
  first_name: string
  last_name: string
}

export type QontoClient = QontoClientCompany | QontoClientIndividual

export type QontoCreateClient = Omit<QontoClientCompany, 'id' | 'created_at'> & {
  currency: string
}
