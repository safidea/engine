import fs from 'fs-extra'
import debug from 'debug'
import { join } from 'path'
import { StringUtils, ProcessUtils } from 'server-common'
import { PrismaClient } from '../../prisma/client'

import type { DatabaseInterface } from 'shared-database'
import type { PrismaModelInterface } from '../interfaces/prisma.interface'

class PrismaUtils {
  private schemaPath = join(__dirname, '../../prisma/schema.prisma')

  public getModelName(name: string): string {
    return StringUtils.singular(StringUtils.capitalize(name))
  }

  public getEnumName(table: string, field: string): string {
    return StringUtils.capitalize(this.getModelName(table)) + StringUtils.capitalize(field)
  }

  public updateDatabaseSchema(database: DatabaseInterface): void {
    const datasourceSchema = `\n\ngenerator client {
      provider      = "prisma-client-js"
      output        = "./client"
      binaryTargets = ["native", "debian-openssl-1.1.x"]
    }
    
    datasource db {
      provider = "${database.provider}"
      url      = "${database.url}"
    }`
    fs.writeFileSync(this.schemaPath, datasourceSchema)
  }

  public updateModelSchema(modelName: string, modelData: PrismaModelInterface): void {
    const { fields, unique, map } = modelData
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
            const enumName = this.getEnumName(modelName, fieldName)
            enums.push(`\n\nenum ${enumName} {
              ${field.options.join('\n')}
            }`)
            field.type = enumName
          }
          return `${fieldName} ${field.type}${isRequired}${isList}${isPrimary}${isUnique}${hasDefault}${hasRelation}`
        })
        .join('\n')}
  
      ${unique ? `@@unique([${unique.join(', ')}])` : ''}
      ${map ? `@@map("${map}")` : ''}
    }`
    if (enums.length > 0) {
      modelSchema += enums.join('')
    }
    fs.appendFileSync(this.schemaPath, modelSchema)
  }

  public async connect(log: debug.IDebugger, retries = 5): Promise<void> {
    const prisma = new PrismaClient()
    while (retries) {
      try {
        await prisma.$connect()
        log('Database connection successful')
        await prisma.$disconnect()
        break
      } catch (error) {
        log(`Database connection failed. Retries left: ${retries}`)
        retries -= 1
        if (retries === 0) {
          throw new Error('Could not establish a connection with the database')
        }
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
    }
  }

  public generateClient(): void {
    ProcessUtils.runCommand(`npx prisma format --schema ${this.schemaPath}`)
    ProcessUtils.runCommand(`npx prisma generate --schema ${this.schemaPath}`)
  }

  public migrateDatabase(): void {
    if (process.env.NODE_ENV !== 'production') {
      const reset = String(process.env.NODE_ENV) === 'test'
      ProcessUtils.runCommand(
        `npx prisma db push --schema ${this.schemaPath} --skip-generate --accept-data-loss ${
          reset ? '--force-reset' : ''
        }`
      )
    } else {
      ProcessUtils.runCommand(
        `npx prisma migrate dev --name=${name} --schema ${this.schemaPath} --skip-generate --skip-seed --create-only`
      )
      ProcessUtils.runCommand(`npx prisma migrate deploy --schema ${this.schemaPath}`)
    }
  }
}

export default new PrismaUtils()
