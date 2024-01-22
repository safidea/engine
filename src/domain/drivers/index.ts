import type { IJsonValidator } from './IJsonValidator'
import type { IBrowser } from './IBrowser'

export interface Drivers {
  jsonValidator: IJsonValidator
  browser: IBrowser
}
