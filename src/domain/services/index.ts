import { Database, type DatabaseSpi } from './Database'
import { IdGenerator, type IdGeneratorSpi } from './IdGenerator'
import { Logger, type LoggerSpi } from './Logger'
import { Record } from './Record'
import { SchemaValidator, type SchemaValidatorSpi } from './SchemaValidator'
import { Server, type ServerSpi } from './Server'
import { Ui, type UiSpi } from './Ui'
import type { ReactComponents } from '@domain/entities/Component'

export interface Spis {
  components: ReactComponents
  server: () => ServerSpi
  database: () => DatabaseSpi
  logger: (location: string) => LoggerSpi
  idGenerator: () => IdGeneratorSpi
  schemaValidator: () => SchemaValidatorSpi
  ui: () => UiSpi
}

export class Services {
  components: ReactComponents

  constructor(private spis: Spis) {
    this.components = this.spis.components
  }

  logger = (location: string) => new Logger(this.spis.logger(location))
  idGenerator = () => new IdGenerator(this.spis.idGenerator())
  database = () => new Database(this.spis.database())
  server = () => new Server(this.spis.server())
  schemaValidator = () => new SchemaValidator(this.spis.schemaValidator())
  ui = () => new Ui(this.spis.ui())

  record = () => new Record({ idGenerator: this.idGenerator() })
}
