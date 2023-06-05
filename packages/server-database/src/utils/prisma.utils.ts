import fs from 'fs-extra'
import { join } from 'path'
import { StringUtils, ProcessUtils } from 'server-common'

import type { DatabaseInterface } from 'shared-database'
import type { PrismaModelInterface } from '../interfaces/prisma.interface'

class PrismaUtils {
  private schemaPath = join(__dirname, '../../prisma/schema.prisma')

  public getModelName(name: string): string {
    return StringUtils.singular(StringUtils.capitalize(name))
  }

  public updateDatabaseSchema(database: DatabaseInterface): void {
    const datasourceSchema = `\n\ndatasource db {
      provider = "${database.provider}"
      url      = "${database.url}"
    }`
    const databaseSchema = fs.readFileSync(this.schemaPath, 'utf8')
    const datasourceSchemaRegex = new RegExp(`datasource db {([\\s\\S]*?)}`, 'g')
    if (datasourceSchemaRegex.test(databaseSchema)) {
      const newDatabaseSchema = databaseSchema.replace(datasourceSchemaRegex, datasourceSchema)
      fs.writeFileSync(this.schemaPath, newDatabaseSchema)
    } else {
      fs.appendFileSync(this.schemaPath, datasourceSchema)
    }
  }

  public updateModelSchema(modelName: string, modelData: PrismaModelInterface): void {
    const { fields, unique, map } = modelData
    const modelSchema = `\n\nmodel ${modelName} {
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
  
      ${unique ? `@@unique([${unique.join(', ')}])` : ''}
      ${map ? `@@map("${map}")` : ''}
    }`
    const databaseSchema = fs.readFileSync(this.schemaPath, 'utf8')
    const modelSchemaRegex = new RegExp(`model ${modelName} {([\\s\\S]*?)}`, 'g')
    if (modelSchemaRegex.test(databaseSchema)) {
      const newDatabaseSchema = databaseSchema.replace(modelSchemaRegex, modelSchema)
      fs.writeFileSync(this.schemaPath, newDatabaseSchema)
    } else {
      fs.appendFileSync(this.schemaPath, modelSchema)
    }
  }

  public buildClient(): void {
    this.formatSchema()
    this.generateClient()
    if (process.env.NODE_ENV !== 'production') {
      this.pushDB(String(process.env.NODE_ENV) === 'test')
    } else {
      this.devMigration()
      this.deployMigration()
    }
  }

  private formatSchema(): void {
    ProcessUtils.runCommand(`npx prisma format --schema ${this.schemaPath}`)
  }

  private generateClient(): void {
    ProcessUtils.runCommand(`npx prisma generate --schema ${this.schemaPath}`)
  }

  private pushDB(reset = false): void {
    ProcessUtils.runCommand(
      `npx prisma db push --schema ${this.schemaPath} --skip-generate --accept-data-loss ${
        reset ? '--force-reset' : ''
      }`
    )
  }

  private devMigration(): void {
    ProcessUtils.runCommand(
      `npx prisma migrate dev --name=${name} --schema ${this.schemaPath} --skip-generate --skip-seed --create-only`
    )
  }

  private deployMigration(): void {
    ProcessUtils.runCommand(`npx prisma migrate deploy --schema ${this.schemaPath}`)
  }
}

export default new PrismaUtils()
