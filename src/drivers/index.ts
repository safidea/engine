import Browser from './Browser'
import JsonValidator from './JsonValidator'
import type { Drivers } from '@domain/drivers'

export const drivers: Drivers = {
  jsonValidator: JsonValidator,
  browser: Browser,
}
