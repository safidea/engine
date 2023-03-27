import fs from 'fs-extra'
import { join } from 'path'
import debug from 'debug'
import { execSync } from 'child_process'

import { Config } from '../types'

const { NODE_ENV, FOUNDATION_CONFIG_FILE } = process.env
const SCHEMA_PATH = join(__dirname, '..', 'prisma/schema.prisma')

const log: debug.IDebugger = debug('table:setup')
const config: Config = JSON.parse(fs.readFileSync(String(FOUNDATION_CONFIG_FILE), 'utf8'))

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
  log('Database schema created')

  execSync(`prisma format`)
  log('Database schema formatted')

  execSync(`prisma migrate dev --name ${NODE_ENV}`)
  log('Database migrated')
}
