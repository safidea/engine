import fs from 'fs-extra'
import { execSync } from 'child_process'
import { join } from 'path'
import { ConfigService, StringUtils, PathSettings } from 'foundation-common/server'
import { Database } from '../../types'
import { Base, Model } from '../interfaces/prisma.interface'
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
    //if (database.accounts) tables = { ...tables, ...ACCOUNTS_TABLES }

    const datasourceSchema = `generator client {
        provider = "prisma-client-js"
        output   = "${this.clientPath}"
      }`
    const databaseSchema = fs.readFileSync(this.schemaPath)
    const datasourceSchemaRegex = new RegExp(`datasource db {([\\s\\S]*?)}`, 'g')
    const newDatabaseSchema = databaseSchema.replace(modelSchemaRegex, modelSchema)
    return schema
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

  updateModelSchema(modelName: string, modelData: model) {
    const fields = Object.entries({ ...modelData.fields, ...DEFAULT_FIELDS })
    const modelSchema = `model ${name} {
      ${fields
        .map(([fieldName, field]) => {
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
          return `${fieldName} ${field.type}${isRequired}${isList}${isPrimary}${isUnique}${hasDefault}${hasRelation}`
        })
        .join('\n')}
  
      ${modelData.unique ? `@@unique([${modelData.unique.join(', ')}])` : ''}
      ${modelData.map ? `@@map([${modelData.map.join(', ')}])` : ''}
    }`
    const databaseSchema = fs.readFileSync(this.schemaPath)
    const modelSchemaRegex = new RegExp(`model ${modelName} {([\\s\\S]*?)}`, 'g')
    const newDatabaseSchema = databaseSchema.replace(modelSchemaRegex, modelSchema)
    fs.writeFileSync(this.schemaPath, newDatabaseSchema)
  }

  updateDatabaseSchema(tables: Tables, database: Database): string {
    const datasourceSchema = `datasource db {
      provider = "${database.provider}"
      url      = "${database.url}"
    }`
    const databaseSchema = fs.readFileSync(this.schemaPath)
    const datasourceSchemaRegex = new RegExp(`datasource db {([\\s\\S]*?)}`, 'g')
    const newDatabaseSchema = databaseSchema.replace(datasourceSchemaRegex, datasourceSchema)
    fs.writeFileSync(this.schemaPath, newDatabaseSchema)
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
