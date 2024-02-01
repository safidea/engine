import { Database, type DatabaseSPI } from './Database'
import { IdGenerator, type IdGeneratorSPI } from './IdGenerator'
import { Logger, type LoggerSPI } from './Logger'
import { Record } from './record'
import { SchemaValidator, type SchemaValidatorSPI } from './SchemaValidator'
import { Server, type ServerSPI } from './Server'

export interface SPIs {
  server: () => ServerSPI
  database: () => DatabaseSPI
  logger: (location: string) => LoggerSPI
  idGenerator: () => IdGeneratorSPI
  schemaValidator: () => SchemaValidatorSPI
}

export class Services {
  constructor(private spis: SPIs) {}

  logger = (location: string) => new Logger(this.spis.logger(location))
  idGenerator = () => new IdGenerator(this.spis.idGenerator())
  database = () => new Database(this.spis.database())
  server = () => new Server(this.spis.server())
  schemaValidator = () => new SchemaValidator(this.spis.schemaValidator())

  record = () => new Record({ idGenerator: this.idGenerator() })
}
