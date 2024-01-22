import Browser from './Browser'
import SchemaValidator from './SchemaValidator'
import type { Drivers } from '@domain/drivers'

export const drivers: Drivers = {
  schemaValidator: SchemaValidator,
  browser: Browser,
}
