import type { ISchemaValidator } from './ISchemaValidator'
import type { IBrowser } from './IBrowser'

export interface Drivers {
  schemaValidator: ISchemaValidator
  browser: IBrowser
}
