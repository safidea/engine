import fs from 'fs-extra'
import { execSync } from 'child_process'
import { join } from 'path'
import { PathSettings } from '@common/server'

import type { DatabaseInterface } from '@database'

interface ModelInterface {
  map?: string[]
  unique?: string[]
  fields: {
    [key: string]: {
      type: string
      primary?: boolean
      optional?: boolean
      list?: boolean
      default?: string | number | boolean
      unique?: boolean
      relation?: {
        fields: string[]
        references: string[]
        onDelete: string
      }
    }
  }
}

class PrismaConfig {
  private clientsFolder = '../../../js/server/prisma'

  public updateDatabaseSchema(baseName: string, database: DatabaseInterface): void {
    const schemaPath = this.getSchemaPath(baseName)
    const datasourceSchema = `datasource db {
      provider = "${database.provider}"
      url      = "${database.url}"
    }`
    const databaseSchema = fs.readFileSync(schemaPath, 'utf8')
    const datasourceSchemaRegex = new RegExp(`datasource db {([\\s\\S]*?)}`, 'g')
    const newDatabaseSchema = databaseSchema.replace(datasourceSchemaRegex, datasourceSchema)
    fs.writeFileSync(schemaPath, newDatabaseSchema)
  }

  public updateModelSchema(baseName: string, modelName: string, modelData: ModelInterface): void {
    const schemaPath = this.getSchemaPath(baseName)
    const modelSchema = `model ${modelName} {
      ${Object.keys(modelData.fields)
        .map((fieldName: string) => {
          const field = modelData.fields[fieldName]
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
    const databaseSchema = fs.readFileSync(schemaPath, 'utf8')
    const modelSchemaRegex = new RegExp(`model ${modelName} {([\\s\\S]*?)}`, 'g')
    const newDatabaseSchema = databaseSchema.replace(modelSchemaRegex, modelSchema)
    fs.writeFileSync(schemaPath, newDatabaseSchema)
  }

  public buildClient(baseName: string) {
    if (this.isClientReady(baseName)) return
    const schemaPath = this.getSchemaPath(baseName)
    this.formatSchema(schemaPath)
    this.migrate(schemaPath)
    this.generateClient(schemaPath)
  }

  public buildIndexClients(baseNames: string[]) {
    const indexPath = this.getIndexPath()
    let script = baseNames
      .map((baseName) => `const ${baseName} = require('./${baseName}')`)
      .join('\n')
    script += `\n\nmodule.exports = { ${baseNames.join(', ')} }`
    fs.writeFileSync(indexPath, script)
  }

  private getIndexPath(): string {
    const indexPath = join(__dirname, this.clientsFolder, 'index.js')
    fs.ensureFileSync(indexPath)
    return indexPath
  }

  private getSchemaPath(baseName: string): string {
    const schemaPath = join(PathSettings.getDataFolder(), `prisma/${baseName}/schema.prisma`)
    fs.ensureFileSync(schemaPath)
    return schemaPath
  }

  private getClientPath(baseName: string): string {
    const clientPath = join(__dirname, this.clientsFolder, baseName)
    fs.ensureDirSync(clientPath)
    return clientPath
  }

  private isClientReady(baseName: string): boolean {
    const clientSchemaPath = join(this.getClientPath(baseName), 'schema.prisma')
    fs.ensureFileSync(clientSchemaPath)
    const clientSchema = fs.readFileSync(clientSchemaPath, 'utf8')
    const schema = fs.readFileSync(this.getSchemaPath(baseName), 'utf8')
    return clientSchema === schema
  }

  private formatSchema(schemaPath: string) {
    execSync(`prisma format --schema ${schemaPath}`)
  }

  private migrate(schemaPath: string) {
    execSync(`prisma migrate dev --schema ${schemaPath} --name init --skip-generate`)
  }

  private generateClient(schemaPath: string) {
    execSync(`prisma generate --schema ${schemaPath}`)
  }

  private reset(schemaPath: string) {
    execSync(`prisma migrate reset --schema ${schemaPath} --force`)
  }
}

export default new PrismaConfig()
