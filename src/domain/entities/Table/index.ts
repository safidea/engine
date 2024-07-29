import type { DatabaseTable } from '@domain/services/DatabaseTable'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Logger } from '@domain/services/Logger'
import type { Field } from '../Field'
import { Record } from '@domain/entities/Record'
import type { Data as ToCreateData } from '@domain/entities/Record/ToCreate'
import type { Data as ToUpdateData } from '@domain/entities/Record/ToUpdate'
import { Json } from '@domain/entities/Response/Json'
import type { Post } from '@domain/entities/Request/Post'
import type { Patch } from '@domain/entities/Request/Patch'
import type { Get } from '@domain/entities/Request/Get'
import { Is } from '@domain/entities/Filter/Is'
import type { Delete } from '@domain/entities/Request/Delete'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { JSONSchema, SchemaValidator } from '@domain/services/SchemaValidator'
import type { SchemaError } from '../Error/Schema'
import { SingleSelect } from '../Field/SingleSelect'
import { SingleLineText } from '../Field/SingleLineText'
import { LongText } from '../Field/LongText'
import { Email } from '../Field/Email'
import { Number } from '../Field/Number'
import { DateTime } from '../Field/DateTime'

interface Params {
  name: string
  fields: Field[]
  server: Server
  database: Database
  logger: Logger
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  schemaValidator: SchemaValidator
}

export class Table {
  name: string
  fields: Field[]
  path: string
  recordPath: string
  private database: DatabaseTable
  private validateData: (json: unknown, schema: JSONSchema) => SchemaError[]

  constructor(private params: Params) {
    const { database, schemaValidator, name, fields } = params
    this.name = name
    this.fields = fields
    this.path = `/api/table/${this.name}`
    this.recordPath = `${this.path}/:id`
    this.database = database.table(this.name)
    this.validateData = schemaValidator.validate
  }

  init = async () => {
    const { server } = this.params
    await Promise.all([
      server.post(this.path, this.post),
      server.get(this.path, this.getAll),
      server.get(this.recordPath, this.get),
      server.patch(this.recordPath, this.patch),
      server.delete(this.recordPath, this.delete),
    ])
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    return []
  }

  get record() {
    const { idGenerator, templateCompiler } = this.params
    return new Record({ idGenerator, templateCompiler })
  }

  getSchema = (options?: { required: boolean }): JSONSchema => {
    const { required = true } = options || {}
    const schema: JSONSchema = {
      type: 'object',
      properties: {},
      required: [],
    }
    for (const field of this.fields) {
      if (field.name === 'id' || field.name === 'created_at' || field.name === 'updated_at')
        continue
      if (field instanceof SingleSelect) {
        schema.properties[field.name] = {
          type: 'string',
          enum: field.options,
        }
      }
      if (
        field instanceof SingleLineText ||
        field instanceof LongText ||
        field instanceof Email ||
        field instanceof DateTime
      ) {
        schema.properties[field.name] = { type: 'string' }
      }
      if (field instanceof Number) {
        schema.properties[field.name] = { type: 'number' }
      }
      if (required && field.required) {
        schema.required.push(field.name)
      }
    }
    return schema
  }

  validateDataType = <T>(data: unknown, schema: JSONSchema): data is T => {
    return this.validateData(data, schema).length === 0
  }

  post = async (request: Post) => {
    const { body } = request
    const schema = this.getSchema()
    if (this.validateDataType<ToCreateData>(body, schema)) {
      const toCreateRecord = this.record.create(body)
      const persistedRecord = await this.database.insert(toCreateRecord)
      return new Json({ record: persistedRecord.data })
    }
    const [error] = this.validateData(body, schema)
    return new Json({ error }, 400)
  }

  patch = async (request: Patch) => {
    const { body } = request
    const schema = this.getSchema({ required: false })
    if (this.validateDataType<ToUpdateData>(body, schema)) {
      const id = request.getParamOrThrow('id')
      const toUpdateRecord = this.record.update({ ...body, id })
      const persistedRecord = await this.database.update(toUpdateRecord)
      return new Json({ record: persistedRecord.data })
    }
    const [error] = this.validateData(body, schema)
    return new Json({ error }, 400)
  }

  get = async (request: Get) => {
    const id = request.getParamOrThrow('id')
    const record = await this.database.readById(id)
    if (!record) {
      return new Json({ record: null })
    }
    return new Json({ record: record.data })
  }

  getAll = async () => {
    const records = await this.database.list([])
    return new Json({ records: records.map((record) => record.data) })
  }

  delete = async (request: Delete) => {
    const id = request.getParamOrThrow('id')
    await this.database.delete([new Is({ field: 'id', value: id })])
    return new Json({ id })
  }
}
