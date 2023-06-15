import fs from 'fs-extra'
import { join } from 'path'
import { execSync, spawn } from 'child_process'
import { StringUtils } from 'shared-common'
import { PrismaClient } from '../../prisma/client'

import type { DatabaseInterface } from 'shared-database'
import type {
  DatabaseProviderInterface,
  DatabaseProviderTableInterface,
} from 'server-database/src/interfaces/database.interface'
import type { TableInterface } from 'shared-table'

const pathToSchema = join(__dirname, '../../prisma/schema.prisma')
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
          if (field.type === 'SingleSelect' && field.options) {
            field.enum = this.getTableEnumName(tableName, fieldName)
            enums.push(`\n\nenum ${field.enum} {
              ${field.options.join('\n')}
            }`)
          }
          const fieldType = field.enum ?? field.type
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
    execSync(`npx prisma format --schema ${pathToSchema}`)
    execSync(`npx prisma generate --schema ${pathToSchema}`)
  }

  public async testConnection(retries = 5): Promise<void> {
    const prisma = new PrismaClient()
    while (retries) {
      try {
        await prisma.$connect()
        await prisma.$disconnect()
        break
      } catch (error) {
        retries -= 1
        if (retries === 0) {
          throw new Error('Could not establish a connection with the database: ' + error.message)
        }
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
    }
  }

  public async testMigration(): Promise<void> {
    const name = StringUtils.slugify(this.appName + '_' + this.appVersion)
    return new Promise((resolve, reject) => {
      const prisma = spawn('npx', [
        'prisma',
        'migrate',
        'dev',
        `--name=${name}`,
        `--schema=${pathToSchema}`,
        '--skip-generate',
        '--skip-seed',
        '--create-only',
      ])

      // Listen for output (stdout)
      prisma.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
      })

      // Listen for errors (stderr)
      prisma.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
        reject(data)
      })

      // Handle process close event
      prisma.on('close', (code) => {
        console.log(`Prisma migrate dev process exited with code ${code}`)
        resolve()
      })
    })
  }
}

export default PrismaProvider
