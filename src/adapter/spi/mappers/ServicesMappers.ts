import type { IServicesMappers } from '@domain/mappers/IServicesMappers'
import { DatabaseMapper } from './DatabaseMapper'
import type { IDrivers } from '../drivers/IDrivers'
import { ServerMapper } from './ServerMapper'
import { LoggerMapper } from './LoggerMapper'
import { IdGeneratorMapper } from './IdGeneratorMapper'
import { SchemaValidatorMapper } from './SchemaValidatorMapper'

export class ServicesMappers implements IServicesMappers {
  constructor(private drivers: IDrivers) {}

  database = () => new DatabaseMapper(this.drivers.database())
  server = () => new ServerMapper(this.drivers.server())
  idGenerator = () => new IdGeneratorMapper(this.drivers.idGenerator())
  logger = (location: string) => new LoggerMapper(this.drivers.logger(location))
  schemaValidator = () => new SchemaValidatorMapper(this.drivers.schemaValidator())
}
