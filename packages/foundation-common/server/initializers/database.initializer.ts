import { join } from 'path'
import debug from 'debug'
import { ConfigService, SchemaService } from 'foundation-common/server'
import { Database, Tables } from '../../types'
import PrismaService from '../services/prisma.service'

const log: debug.IDebugger = debug('database:init')

export default function DatabaseInitializer(config?: Config) {
  const { NODE_ENV } = process.env
  const pathToType = join(__dirname, '../..', 'types/config.type.ts')
  const database = config.database ?? (ConfigService.get('database') as Database)
  const tables = config.tables ?? (ConfigService.get('tables') as Tables)

  const isUpdated = SchemaService.cache(database, 'database')
  if (!isUpdated) {
    log('Database is up to date')
  } else {
    log('Database has been updated')

    SchemaService.validate(database, { path: pathToType, type: 'Database' })
    log('Database schema validated')
  }

  for (const name of ResourceService.getNames()) {
    SchemaService.validate(tables, { path, type: 'Tables' })
    log('Tables schema validated')

    PrismaService.writeSchema(tables, database)
    log('Database schema created')

    PrismaService.formatSchema()
    log('Database schema formatted')

    if (NODE_ENV !== 'production') {
      PrismaService.migrate(String(NODE_ENV))
      log(`Database migrated`)
    }
  }

  if (!PrismaService.isClientReady()) {
    PrismaService.generateClient()
    log('Database client generated')
  } else {
    log('Database client is up to date')
  }

  if (NODE_ENV === 'test') {
    PrismaService.reset()
    log(`Database reset for ${NODE_ENV} environment`)
  }
}
