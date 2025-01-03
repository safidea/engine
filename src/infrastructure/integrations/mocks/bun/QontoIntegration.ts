import type { QontoClient, QontoCreateClient, QontoConfig } from '@domain/integrations/Qonto'
import type { IQontoIntegration } from '@adapter/spi/integrations/QontoSpi'
import { Database } from 'bun:sqlite'

export class QontoIntegration implements IQontoIntegration {
  private db: Database

  constructor(private _config?: QontoConfig) {
    this.db = new Database('file::memory:?cache=shared')
    this.db.run(`
      CREATE TABLE IF NOT EXISTS Clients (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        email TEXT,
        vat_number TEXT,
        tax_identification_number TEXT,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        country_code TEXT NOT NULL,
        billing_address TEXT,
        delivery_address TEXT,
        name TEXT,
        first_name TEXT,
        last_name TEXT,
        created_at TEXT NOT NULL,
        locale TEXT NOT NULL
      )
    `)
  }

  getConfig = (): QontoConfig => {
    if (!this._config) {
      throw new Error('Qonto config not set')
    }
    return this._config
  }

  createClient = async (client: QontoCreateClient): Promise<QontoClient> => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
    const createdAt = new Date().toISOString()
    const billingAddress = client.billing_address ? JSON.stringify(client.billing_address) : null
    const deliveryAddress = client.delivery_address ? JSON.stringify(client.delivery_address) : null
    this.db.run(
      `
      INSERT INTO Clients (
        id, type, email, vat_number, tax_identification_number, address, city, zip_code, 
        country_code, billing_address, delivery_address, name, first_name, last_name, 
        created_at, locale
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        client.type,
        client.email || null,
        client.vat_number || null,
        client.tax_identification_number || null,
        client.address,
        client.city,
        client.zip_code,
        client.country_code,
        billingAddress,
        deliveryAddress,
        client.name || null,
        client.first_name || null,
        client.last_name || null,
        createdAt,
        client.locale,
      ]
    )
    const createdClient: QontoClient =
      client.type === 'company'
        ? {
            id,
            type: 'company',
            name: client.name!,
            email: client.email,
            vat_number: client.vat_number,
            tax_identification_number: client.tax_identification_number,
            address: client.address,
            city: client.city,
            zip_code: client.zip_code,
            country_code: client.country_code,
            billing_address: client.billing_address,
            delivery_address: client.delivery_address,
            created_at: createdAt,
            locale: client.locale,
          }
        : {
            id,
            type: 'individual',
            first_name: client.first_name!,
            last_name: client.last_name!,
            email: client.email,
            vat_number: client.vat_number,
            tax_identification_number: client.tax_identification_number,
            address: client.address,
            city: client.city,
            zip_code: client.zip_code,
            country_code: client.country_code,
            billing_address: client.billing_address,
            delivery_address: client.delivery_address,
            created_at: createdAt,
            locale: client.locale,
          }

    return createdClient
  }
}
