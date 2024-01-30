import type { IServicesMappers } from '../mappers/IServicesMappers'
import { Database } from './database/Database'
import { IdGenerator } from './idGenerator/IdGenerator'
import { Logger } from './logger/Logger'
import { Record } from './record/Record'
import { SchemaValidator } from './schemaValidator/SchemaValidator'
import { Server } from './server/Server'

export class Services {
  constructor(private mappers: IServicesMappers) {}

  logger = (location: string) => new Logger(this.mappers.logger(location))
  idGenerator = () => new IdGenerator(this.mappers.idGenerator())
  database = () => new Database(this.mappers.database())
  server = () => new Server(this.mappers.server())
  schemaValidator = () => new SchemaValidator(this.mappers.schemaValidator())

  record = () => new Record({ idGenerator: this.idGenerator() })
}
