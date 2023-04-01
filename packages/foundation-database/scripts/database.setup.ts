import fs from 'fs-extra'
import { join } from 'path'
import debug from 'debug'
import { execSync } from 'child_process'
import { ConfigService, PathUtils } from 'foundation-common'
import * as SchemaSetup from 'foundation-common/scripts/schema.setup'

import { Config, Field, Table } from '../types'
import { DEFAULT_FIELDS } from '../src/constants/database.constants'

const { NODE_ENV } = process.env
const log: debug.IDebugger = debug('database:setup')
const stdio = NODE_ENV === 'development' ? 'inherit' : 'ignore'
const schemaValidatorParams = {
  path: join(__dirname, '..', 'types/config.type.ts'),
}

export default async function DatabaseSetup() {
  const { database, tables } = (await ConfigService.get()) as Config
  const SCHEMA_PATH = PathUtils.prismaSchema()
  const CLIENT_PATH = PathUtils.prismaClient()

  const isUpdated = await SchemaSetup.cache({ database, tables }, 'database')
  if (!isUpdated) {
    log('Database schema is up to date')
  } else {
    log('Database schema has been updated')
    await SchemaSetup.validate(database, {
      ...schemaValidatorParams,
      type: 'Database',
    })
    await SchemaSetup.validate(tables, {
      ...schemaValidatorParams,
      type: 'Tables',
    })
    log('Database schema validated')

    let schema = `generator client {
      provider = "prisma-client-js"
      output   = "${CLIENT_PATH}"
    }

    datasource db {
      provider = "${database.provider}"
      url      = "${database.url}"
    }\n`

    schema += Object.keys(tables)
      .map((modelName) => {
        const modelData = { ...tables[modelName], ...DEFAULT_FIELDS } as Table
        const fields = Object.keys(modelData).map((fieldName) => {
          const fieldData = modelData[fieldName as keyof typeof modelData] as Field
          let fieldType = ''
          let defaultValue = fieldData.default ?? ''
          switch (fieldData.type) {
            case 'integer':
              fieldType = 'Int'
              break
            case 'string':
              fieldType = 'String'
              defaultValue = fieldData.primary ? defaultValue : `"${defaultValue}"`
              break
            case 'datetime':
              fieldType = 'DateTime'
              break
            case 'boolean':
              fieldType = 'Boolean'
              break
          }
          const isRequired = fieldData.nullable ? '?' : ''
          const isPrimary = fieldData.primary ? ' @id' : ''
          const hasDefault = defaultValue ? ` @default(${defaultValue})` : ''
          return `${fieldName} ${fieldType}${isRequired}${isPrimary}${hasDefault}`
        })
        return `model ${modelName} {
        ${fields.join('\n  ')}
      }`
      })
      .join('\n')

    fs.writeFileSync(SCHEMA_PATH, schema)
    log('Database schema created')

    execSync(`prisma format --schema ${SCHEMA_PATH}`)
    log('Database schema formatted')

    if (NODE_ENV !== 'production') {
      execSync(`prisma migrate dev --schema ${SCHEMA_PATH} --name ${NODE_ENV}`, { stdio })
      log(`Database migrated`)
    }
  }

  execSync(`prisma generate --schema ${SCHEMA_PATH}`)
  log('Database client generated')

  if (NODE_ENV === 'test') {
    execSync(`prisma migrate reset --schema ${SCHEMA_PATH} --force`, { stdio })
    log(`Database reset for ${NODE_ENV} environment`)
  }
}
