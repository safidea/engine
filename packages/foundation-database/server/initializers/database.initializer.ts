import { join } from 'path'
import debug from 'debug'
import { ConfigService, SchemaService } from 'foundation-common/server'
import { Config } from '../../types'
import PrismaService from '../services/prisma.service'

const log: debug.IDebugger = debug('database:init')

export default function DatabaseInitializer(config?: Config) {
  const { NODE_ENV } = process.env
  const { database, tables } = config ?? (ConfigService.get() as Config)
  const isUpdated = SchemaService.cache({ database, tables }, 'database')

  if (!isUpdated) {
    log('Database schema is up to date')
  } else {
    log('Database schema has been updated')

    const path = join(__dirname, '../..', 'types/config.type.ts')
    SchemaService.validate(database, { path, type: 'Database' })
    SchemaService.validate(tables, { path, type: 'Tables' })
    log('Database schema validated')

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
