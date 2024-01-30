import type { IDatabaseMapper } from "./IDatabaseMapper"
import type { IIdGeneratorMapper } from "./IIdGeneratorMapper"
import type { ILoggerMapper } from "./ILoggerMapper"
import type { ISchemaValidatorMapper } from "./ISchemaValidatorMapper"
import type { IServerMapper } from "./IServerMapper"

export interface IServicesMappers {
  server: () => IServerMapper
  database: () => IDatabaseMapper
  logger: (location: string) => ILoggerMapper
  idGenerator: () => IIdGeneratorMapper
  schemaValidator: () => ISchemaValidatorMapper
}
