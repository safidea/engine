import fs from 'fs-extra'
import cp from 'child_process'
import { join } from 'path'
import { PathUtils, StringUtils, AppUtils } from 'server-common'

import type { DatabaseInterface } from 'shared-database'
import type { PrismaModelInterface } from '../interfaces/prisma.interface'

class PrismaUtils {
  public getModelName(name: string): string {
    return StringUtils.singular(StringUtils.capitalize(name))
  }

  public getSchemaPath(baseName: string): string {
    const schemaPath = join(PathUtils.getAppDataFolder(), `prisma/${baseName}/schema.prisma`)
    if (!fs.existsSync(schemaPath)) {
      fs.ensureFileSync(schemaPath)
      fs.writeFileSync(
        schemaPath,
        `generator client {
        provider = "prisma-client-js"
        output   = "${this.getClientPath(baseName)}"
      }`
      )
    }
    return schemaPath
  }

  public updateDatabaseSchema(baseName: string, database: DatabaseInterface): void {
    const schemaPath = this.getSchemaPath(baseName)
    const datasourceSchema = `\n\ndatasource db {
      provider = "${database.provider}"
      url      = "${database.url}"
    }`
    const databaseSchema = fs.readFileSync(schemaPath, 'utf8')
    const datasourceSchemaRegex = new RegExp(`datasource db {([\\s\\S]*?)}`, 'g')
    if (datasourceSchemaRegex.test(databaseSchema)) {
      const newDatabaseSchema = databaseSchema.replace(datasourceSchemaRegex, datasourceSchema)
      fs.writeFileSync(schemaPath, newDatabaseSchema)
    } else {
      fs.appendFileSync(schemaPath, datasourceSchema)
    }
  }

  public updateModelSchema(
    baseName: string,
    modelName: string,
    modelData: PrismaModelInterface
  ): void {
    const { fields, unique, map } = modelData
    const schemaPath = this.getSchemaPath(baseName)
    const modelSchema = `\n\nmodel ${modelName} {
      ${Object.keys(fields)
        .map((fieldName: string) => {
          const field = fields[fieldName]
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
  
      ${unique ? `@@unique([${unique.join(', ')}])` : ''}
      ${map ? `@@map("${map}")` : ''}
    }`
    const databaseSchema = fs.readFileSync(schemaPath, 'utf8')
    const modelSchemaRegex = new RegExp(`model ${modelName} {([\\s\\S]*?)}`, 'g')
    if (modelSchemaRegex.test(databaseSchema)) {
      const newDatabaseSchema = databaseSchema.replace(modelSchemaRegex, modelSchema)
      fs.writeFileSync(schemaPath, newDatabaseSchema)
    } else {
      fs.appendFileSync(schemaPath, modelSchema)
    }
  }

  public buildClient(baseName: string) {
    if (this.isClientReady(baseName)) return
    const schemaPath = this.getSchemaPath(baseName)
    this.formatSchema(schemaPath)
    this.generateClient(schemaPath)
    this.pushDatabase(schemaPath, process.env.NODE_ENV === 'test')
  }

  public importClients(baseNames: string[]) {
    const indexPath = this.getIndexPath()
    let script = baseNames
      .map((baseName) => `const ${baseName} = require('./${baseName}')`)
      .join('\n')
    script += `\n\nmodule.exports = { ${baseNames.join(', ')} }`
    fs.writeFileSync(indexPath, script)
    AppUtils.addImport(
      `export { default as PrismaClients } from '${this.getClientFolder()}'`,
      'server-database'
    )
  }

  public getClientFolder(): string {
    const clientFolderPath = join(PathUtils.getAppJsFolder(), 'prisma')
    fs.ensureDirSync(clientFolderPath)
    return clientFolderPath
  }

  private getClientPath(baseName: string): string {
    const clientPath = join(this.getClientFolder(), baseName)
    fs.ensureDirSync(clientPath)
    return clientPath
  }

  private getIndexPath(): string {
    const indexPath = join(this.getClientFolder(), 'index.js')
    fs.ensureFileSync(indexPath)
    return indexPath
  }

  private isClientReady(baseName: string): boolean {
    const clientSchemaPath = join(this.getClientPath(baseName), 'schema.prisma')
    fs.ensureFileSync(clientSchemaPath)
    const clientSchema = fs.readFileSync(clientSchemaPath, 'utf8')
    const schema = fs.readFileSync(this.getSchemaPath(baseName), 'utf8')
    return !!clientSchema && !!schema && clientSchema === schema
  }

  private formatSchema(schemaPath: string) {
    cp.execSync(`prisma format --schema ${schemaPath}`)
  }

  private generateClient(schemaPath: string) {
    cp.execSync(`prisma generate --schema ${schemaPath}`)
  }

  private pushDatabase(schemaPath: string, forceReset: boolean) {
    cp.execSync(
      `prisma db push --schema ${schemaPath} --accept-data-loss ${
        forceReset ? '--force-reset' : ''
      }`
    )
  }
}

export default new PrismaUtils()
