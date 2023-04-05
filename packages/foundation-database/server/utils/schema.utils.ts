import fs from 'fs-extra'
import { join } from 'path'
import { StringUtils } from 'foundation-common'
import { Field, Table, Tables, Database } from '../../types'
import { ACCOUNTS_TABLES } from '../settings/accounts.settings'
import { DEFAULT_FIELDS } from '../settings/fields.settings'

export function getPrismaClientPath(): string {
  const path = join(__dirname, '../../generated/server/prisma')
  fs.ensureDirSync(path)
  return path
}

export function getPrismaModelName(name: string): string {
  return StringUtils.singular(StringUtils.capitalize(name))
}

export function getPrismaFieldSchema(name: string, field: Field): string {
  const functions = ['uuid()', 'cuid()', 'autoincrement()', 'now()']
  const defaultValue =
    field.type === 'String' && !functions.includes(String(field.default))
      ? `"${field.default}"`
      : field.default
  const isRequired = field.optional ? '?' : ''
  const isList = field.list ? '[]' : ''
  const isPrimary = field.primary ? ' @id' : ''
  const isUnique = field.unique ? ' @unique' : ''
  const hasDefault = field.default ? ` @default(${defaultValue})` : ''
  const hasRelation = field.relation
    ? ` @relation(fields: [${field.relation.fields.join(
        ','
      )}], references: [${field.relation.references.join(',')}], onDelete: ${
        field.relation.onDelete
      })`
    : ''
  return `${name} ${field.type}${isRequired}${isList}${isPrimary}${isUnique}${hasDefault}${hasRelation}`
}

export function getPrismaTableSchema(name: string, table: Table): string {
  const fields = Object.entries({ ...table.fields, ...DEFAULT_FIELDS })
    .map(([name, field]) => getPrismaFieldSchema(name, field))
    .join('\n')

  const model = table.model || getPrismaModelName(name)
  return `model ${model} {
    ${fields}

    ${table.unique ? `@@unique([${table.unique.join(', ')}])` : ''}
    @@map("${name}")
  }`
}

export function getPrismaSchema(tables: Tables, database: Database): string {
  if (database.accounts) tables = { ...tables, ...ACCOUNTS_TABLES }

  let schema = `generator client {
    provider = "prisma-client-js"
    output   = "${getPrismaClientPath()}"
  }
  datasource db {
    provider = "${database.provider}"
    url      = "${database.url}"
  }\n`

  schema += Object.entries(tables)
    .map(([name, table]) => getPrismaTableSchema(name, table))
    .join('\n')

  return schema
}
