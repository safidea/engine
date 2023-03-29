import fs from 'fs-extra'
import { join } from 'path'
import debug from 'debug'
import { execSync } from 'child_process'

import { Config, Field } from '../../types'

const { NODE_ENV, FOUNDATION_CONFIG_FILE } = process.env
const SCHEMA_PATH = join(__dirname, '../..', 'prisma/schema.prisma')

const log: debug.IDebugger = debug('table:setup')
const config: Config = JSON.parse(fs.readFileSync(String(FOUNDATION_CONFIG_FILE), 'utf8'))

const technicalFields = {
  id: {
    type: 'string',
    primary: true,
    default: 'uuid()',
  },
  created_at: {
    type: 'datetime',
    nullable: false,
    default: 'now()',
  },
  updated_at: {
    type: 'datetime',
    nullable: false,
    default: 'now()',
  },
  deleted_at: {
    type: 'datetime',
    nullable: true,
  },
}

export default function TableSetup() {
  if (config.database) {
    const {
      database: { url, provider },
      tables,
    } = config

    let schema = `generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "${provider}"
      url      = "${url}"
    }\n`

    schema += Object.keys(tables)
      .map((modelName) => {
        const modelData = { ...tables[modelName], ...technicalFields }
        const fields = Object.keys(modelData).map((fieldName) => {
          const fieldData = modelData[fieldName as keyof typeof modelData] as Field
          let fieldType = ''
          let defaultValue = ''
          switch (fieldData.type) {
            case 'integer':
              fieldType = 'Int'
              defaultValue = `@default(${fieldData.default ?? 0})`
              break
            case 'string':
              fieldType = 'String'
              defaultValue = fieldData.primary
                ? `@default(${fieldData.default})`
                : `@default("${fieldData.default ?? ''}")`
              break
            case 'datetime':
              fieldType = 'DateTime'
              defaultValue = `@default(${fieldData.default ?? 'now()'})`
              break
            case 'boolean':
              fieldType = 'Boolean'
              defaultValue = `@default(${fieldData.default ?? false})`
              break
          }
          const isPrimary = fieldData.primary ? ' @id' : ''
          const isRequired = !fieldData.nullable && !fieldData.default ? '' : ` ${defaultValue}`
          return `${fieldName} ${fieldType}${isPrimary}${isRequired}`
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

    execSync(`prisma generate --schema ${SCHEMA_PATH}`)
    log('Database client generated')

    if (NODE_ENV !== 'production') {
      execSync(`prisma migrate reset --schema ${SCHEMA_PATH} --force`)
      log(`Database reset for ${NODE_ENV} environment`)
    }

    execSync(`prisma migrate dev --schema ${SCHEMA_PATH} --name ${NODE_ENV}`)
    log('Database migrated')
  }
}
