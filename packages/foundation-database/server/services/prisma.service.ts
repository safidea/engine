import fs from 'fs-extra'
import { execSync } from 'child_process'
import { join } from 'path'
import { ConfigService, StringUtils, PathSettings } from 'foundation-common/server'
import { Field, Table, Tables, Database, Base } from '../../types'
import { PrismaClient } from '../../generated/server/prisma'
import { ACCOUNTS_TABLES } from '../settings/accounts.settings'
import { DEFAULT_FIELDS } from '../settings/fields.settings'

const { ROOT_PATH, DATA_FOLDER } = PathSettings
const FOLDER_PATH = '../../generated/server/prisma'

class PrismaService {
  private prisma: PrismaClient
  private schemaPath: string
  private clientPath: string

  constructor() {
    this.prisma = new PrismaClient()
    this.schemaPath = join(ROOT_PATH, DATA_FOLDER, 'prisma/schema.prisma')
    this.clientPath = join(__dirname, FOLDER_PATH)
    fs.ensureFileSync(this.schemaPath)
    fs.ensureDirSync(this.clientPath)
  }

  getInstance(): PrismaClient {
    return this.prisma
  }

  isClientReady(): boolean {
    const clientSchemaPath = join(this.clientPath, 'schema.prisma')
    fs.ensureFileSync(clientSchemaPath)
    const clientSchema = fs.readFileSync(clientSchemaPath, 'utf8')
    const schema = fs.readFileSync(this.schemaPath, 'utf8')
    return clientSchema === schema
  }

  getModelName(name: string): string {
    return StringUtils.singular(StringUtils.capitalize(name))
  }

  getFieldSchema(name: string, field: Field): string {
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

  getTableSchema(name: string, table: Table): string {
    const fields = Object.entries({ ...table.fields, ...DEFAULT_FIELDS })
      .map(([name, field]) => this.getFieldSchema(name, field))
      .join('\n')

    const model = table.model || this.getModelName(name)
    return `model ${model} {
      ${fields}
  
      ${table.unique ? `@@unique([${table.unique.join(', ')}])` : ''}
      @@map("${name}")
    }`
  }

  getSchema(tables: Tables, database: Database): string {
    if (database.accounts) tables = { ...tables, ...ACCOUNTS_TABLES }

    let schema = `generator client {
      provider = "prisma-client-js"
      output   = "${this.clientPath}"
    }
    datasource db {
      provider = "${database.provider}"
      url      = "${database.url}"
    }\n`

    schema += Object.entries(tables)
      .map(([name, table]) => this.getTableSchema(name, table))
      .join('\n')

    return schema
  }

  writeSchema(tables: Tables, database: Database) {
    const schema = this.getSchema(tables, database)
    fs.writeFileSync(this.schemaPath, schema)
  }

  base(tableName: string): Base {
    let model = ConfigService.get(`tables.${tableName}.model`) as string
    if (!model) model = this.getModelName(tableName)
    return this.prisma[model.toLowerCase() as keyof typeof this.prisma] as unknown as Base
  }

  formatSchema() {
    execSync(`prisma format --schema ${this.schemaPath}`)
  }

  migrate(name: string) {
    execSync(`prisma migrate dev --schema ${this.schemaPath} --name ${name} --skip-generate`)
  }

  generateClient() {
    execSync(`prisma generate --schema ${this.schemaPath}`)
  }

  reset() {
    execSync(`prisma migrate reset --schema ${this.schemaPath} --force`)
  }
}

const service = new PrismaService()

export default service
