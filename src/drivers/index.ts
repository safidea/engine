import PuppeteerBrowser from './PuppeteerBrowser'
import AjvSchemaValidator from './AjvSchemaValidator'
import type { Drivers } from '@domain/drivers'

export const drivers: Drivers = {
  schemaValidator: AjvSchemaValidator,
  browser: PuppeteerBrowser,
}
