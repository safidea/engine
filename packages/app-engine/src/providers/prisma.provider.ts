import fs from 'fs-extra'
import { join } from 'path'
import { execSync } from 'child_process'
import { StringUtils } from 'shared-common'

import type { DatabaseInterface } from 'shared-database'
import type {
  DatabaseProviderInterface,
  DatabaseProviderTableInterface,
} from 'server-database/src/interfaces/database.interface'
import type { TableInterface } from 'shared-table'

const pathToPrismaCache = join(process.env.APP_PATH, '.cache/prisma')
const pathToPrisma = join(__dirname, '../../prisma')
const pathToSchema = join(pathToPrisma, 'schema.prisma')
const pathToClient = join(pathToPrisma, 'client/index.js')

if (!fs.existsSync(pathToClient)) {
  fs.ensureFileSync(pathToClient)
  fs.writeFileSync(pathToClient, 'module.exports.PrismaClient = class {}')
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { PrismaClient } from '../../prisma/client'

const prisma = new PrismaClient()

class PrismaProvider implements DatabaseProviderInterface {
  private appName: string
  private appVersion: string

  constructor({ appVersion, appName }: { appVersion: string; appName: string }) {
    this.appName = appName
    this.appVersion = appVersion
  }

  private getModelName(name: string): string {
    return StringUtils.singular(StringUtils.capitalize(name))
  }

  public table(tableName: string): DatabaseProviderTableInterface | undefined {
    const modelName = this.getModelName(tableName).toLowerCase()
    return prisma[modelName as keyof typeof prisma] as unknown as DatabaseProviderTableInterface
  }

  public getTableEnumName(table: string, field: string): string {
    return StringUtils.capitalize(this.getModelName(table)) + StringUtils.capitalize(field)
  }

  public setConnectionSchema(database: DatabaseInterface): void {
    let binaryTargets = process.env.PRISMA_BINARY_TARGETS ?? ''
    if (binaryTargets)
      binaryTargets = `binaryTargets = ["${binaryTargets.split(',').join('", "')}"]`
    const datasourceSchema = `\n\ngenerator client {
      provider      = "prisma-client-js"
      output        = "./client"
      ${binaryTargets}
    }
    
    datasource db {
      provider = "${database.provider}"
      url      = "${database.url}"
    }`
    fs.ensureFileSync(pathToSchema)
    fs.writeFileSync(pathToSchema, datasourceSchema)
  }

  public addTableSchema(tableName: string, tableConfig: TableInterface): void {
    const modelName = this.getModelName(tableName)
    const { fields, unique } = tableConfig
    const enums: string[] = []
    let modelSchema = `\n\nmodel ${modelName} {
      ${Object.keys(fields)
        .map((fieldName: string) => {
          const field = fields[fieldName]
          const functions = ['uuid()', 'cuid()', 'autoincrement()', 'now()']
          const defaultValue =
            field.type === 'String' && !functions.includes(String(field.default))
              ? `"${field.default}"`
              : field.default
          const isRequired = field.optional || field.type === 'Boolean' ? '?' : ''
          const isList = field.list ? '[]' : ''
          const isPrimary = field.primary ? ' @id' : ''
          const isUnique = field.unique ? ' @unique' : ''
          const hasDefault = field.default != null ? ` @default(${defaultValue})` : ''
          const hasRelation = field.relation
            ? ` @relation(fields: [${field.relation.fields.join(
                ','
              )}], references: [${field.relation.references.join(',')}], onDelete: ${
                field.relation.onDelete
              })`
            : ''
          let enumName: string | undefined
          if (field.type === 'SingleSelect' && field.options) {
            enumName = this.getTableEnumName(tableName, fieldName)
            enums.push(`\n\nenum ${enumName} {
              ${field.options.join('\n')}
            }`)
          }
          const fieldType = enumName ?? field.type
          return `${fieldName} ${fieldType}${isRequired}${isList}${isPrimary}${isUnique}${hasDefault}${hasRelation}`
        })
        .join('\n')}
  
      ${unique ? `@@unique([${unique.join(', ')}])` : ''}
      ${tableName ? `@@map("${tableName}")` : ''}
    }`
    if (enums.length > 0) {
      modelSchema += enums.join('')
    }
    fs.appendFileSync(pathToSchema, modelSchema)
  }

  public async generateClient(): Promise<void> {
    execSync(`npx prisma format`)
    execSync(`npx prisma generate`)
  }

  public async prepareMigration(): Promise<void> {
    const name = StringUtils.slugify(this.appName + '_' + this.appVersion)
    const migrationsPath = join(pathToPrisma, 'migrations')
    const migrationsCachedPath = join(pathToPrismaCache, 'migrations')
    if (fs.existsSync(migrationsCachedPath)) {
      await fs.copy(migrationsCachedPath, migrationsPath)
    } else {
      fs.removeSync(migrationsPath)
    }
    execSync(`npx prisma migrate dev --name=${name} --skip-generate --skip-seed --create-only`)
  }

  public async applyMigration(): Promise<void> {
    execSync(`npx prisma migrate deploy`)
  }

  public async loadCached(): Promise<void> {
    await fs.copy(pathToPrismaCache, pathToPrisma)
  }

  public async cache(): Promise<void> {
    await fs.copy(pathToPrisma, pathToPrismaCache)
  }
}

export default PrismaProvider
