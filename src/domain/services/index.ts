import { Database, type DatabaseSPI } from './Database'
import { IdGenerator, type IdGeneratorSPI } from './IdGenerator'
import { Logger, type LoggerSPI } from './Logger'
import { Record } from './Record'
import { SchemaValidator, type SchemaValidatorSPI } from './SchemaValidator'
import { Server, type ServerSPI } from './Server'
import { UI, type UISPI } from './UI'

export interface SPIs {
  server: () => ServerSPI
  database: () => DatabaseSPI
  logger: (location: string) => LoggerSPI
  idGenerator: () => IdGeneratorSPI
  schemaValidator: () => SchemaValidatorSPI
  ui: () => UISPI
}

export class Services {
  constructor(private spis: SPIs) {}

  logger = (location: string) => new Logger(this.spis.logger(location))
  idGenerator = () => new IdGenerator(this.spis.idGenerator())
  database = () => new Database(this.spis.database())
  server = () => new Server(this.spis.server())
  schemaValidator = () => new SchemaValidator(this.spis.schemaValidator())
  ui = () => new UI(this.spis.ui())

  record = () => new Record({ idGenerator: this.idGenerator() })
}
