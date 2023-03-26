import fs from 'fs-extra'
import { join } from 'path'
import debug from 'debug'

import { Database } from '../types'

const SCHEMA_PATH = join(__dirname, '..', 'prisma/schema.prisma')
const FOUNDATION_CONFIG_FILE = process.env.FOUNDATION_CONFIG_FILE
if (!FOUNDATION_CONFIG_FILE) throw new Error('FOUNDATION_CONFIG_FILE is not defined')
const config: Database = JSON.parse(fs.readFileSync(FOUNDATION_CONFIG_FILE, 'utf8') ?? '{}')
const log: debug.IDebugger = debug('db:setup')

if (config.database) {
  log('Setup database...')

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
      const modelData = tables[modelName]
      const fields = Object.keys(modelData).map((fieldName) => {
        const fieldData = modelData[fieldName]
        let fieldType = ''
        let defaultValue = ''
        switch (fieldData.type) {
          case 'integer':
            fieldType = 'Int'
            defaultValue = fieldData.primary ? ' @default(autoincrement())' : ' @default(0)'
            break
          case 'string':
            fieldType = 'String'
            defaultValue = ' @default("")'
            break
          case 'datetime':
            fieldType = 'DateTime'
            defaultValue = ' @default(now())'
            break
          default:
            fieldType = fieldData.type
            break
        }
        const isPrimary = fieldData.primary ? ' @id' : ''
        const isRequired = !fieldData.nullable ? ` ${defaultValue}` : ''
        return `${fieldName} ${fieldType}${isPrimary}${isRequired}`
      })
      return `model ${modelName} {
        ${fields.join('\n  ')}
      }`
    })
    .join('\n')

  fs.writeFileSync(SCHEMA_PATH, schema)
}
