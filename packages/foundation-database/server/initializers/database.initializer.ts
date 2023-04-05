import fs from 'fs-extra'
import { join } from 'path'
import debug from 'debug'
import { execSync } from 'child_process'
import { ConfigService, PathSettings, SchemaService } from 'foundation-common/server'
import { Config } from '../../types'
import { getPrismaSchema } from '../utils/schema.utils'

const log: debug.IDebugger = debug('database:init')

function getPrismaSchemaPath(): string {
  const { ROOT_PATH, DATA_FOLDER } = PathSettings
  const path = join(ROOT_PATH, DATA_FOLDER, 'prisma/schema.prisma')
  fs.ensureFileSync(path)
  return path
}

function isPrismaClientReady(): boolean {
  const clientSchemaPath = '../../generated/server/prisma/schema.prisma'
  fs.ensureFileSync(clientSchemaPath)
  const clientSchema = fs.readFileSync(join(__dirname, clientSchemaPath), 'utf8')
  const schemaPath = getPrismaSchemaPath()
  const schema = fs.readFileSync(schemaPath, 'utf8')
  return clientSchema === schema
}

export default function DatabaseInitializer(config?: Config) {
  const { NODE_ENV } = process.env
  const SCHEMA_PATH = getPrismaSchemaPath()
  const stdio = NODE_ENV === 'development' ? 'inherit' : 'ignore'
  const { database, tables } = (ConfigService.get() as Config) ?? config
  const isUpdated = SchemaService.cache({ database, tables }, 'database')

  if (!isUpdated) {
    log('Database schema is up to date')
  } else {
    log('Database schema has been updated')

    const path = join(__dirname, '../..', 'types/config.type.ts')
    SchemaService.validate(database, { path, type: 'Database' })
    SchemaService.validate(tables, { path, type: 'Tables' })
    log('Database schema validated')

    fs.writeFileSync(SCHEMA_PATH, getPrismaSchema(tables, database))
    log('Database schema created')

    execSync(`prisma format --schema ${SCHEMA_PATH}`)
    log('Database schema formatted')

    if (NODE_ENV !== 'production') {
      execSync(`prisma migrate dev --schema ${SCHEMA_PATH} --name ${NODE_ENV} --skip-generate`, {
        stdio,
      })
      log(`Database migrated`)
    }
  }

  if (!isPrismaClientReady()) {
    execSync(`prisma generate --schema ${SCHEMA_PATH}`)
    log('Database client generated')
  } else {
    log('Database client is up to date')
  }

  if (NODE_ENV === 'test') {
    execSync(`prisma migrate reset --schema ${SCHEMA_PATH} --force`, { stdio })
    log(`Database reset for ${NODE_ENV} environment`)
  }
}
