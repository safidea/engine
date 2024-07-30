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
import { SingleLinkedRecord } from '../Field/SingleLinkedRecord'
import { MultipleLinkedRecord } from '../Field/MultipleLinkedRecord'

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
  db: DatabaseTable
  private _validateData: (json: unknown, schema: JSONSchema) => SchemaError[]

  constructor(private _params: Params) {
    const { database, schemaValidator, name, fields } = _params
    this.name = name
    this.fields = fields
    this.path = `/api/table/${this.name}`
    this.recordPath = `${this.path}/:id`
    this.db = database.table(this.name, this.fields)
    this._validateData = schemaValidator.validate
  }

  init = async () => {
    const { server } = this._params
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

  dependancies = () => {
    const dependancies: string[] = []
    for (const field of this.fields) {
      if (field instanceof SingleLinkedRecord || field instanceof MultipleLinkedRecord) {
        dependancies.push(field.table)
      }
    }
    return dependancies.filter((value, index, self) => self.indexOf(value) === index)
  }

  get = async (request: Get) => {
    const id = request.getParamOrThrow('id')
    const record = await this.db.readById(id)
    if (!record) {
      return new Json({ record: null })
    }
    return new Json({ record: record.data })
  }

  getAll = async () => {
    const records = await this.db.list([])
    return new Json({ records: records.map((record) => record.data) })
  }

  post = async (request: Post) => {
    try {
      const { body } = request
      const schema = this._getSchema()
      if (this._validateDataType<ToCreateData>(body, schema)) {
        const toCreateRecord = this._record.create(body)
        const persistedRecord = await this.db.insert(toCreateRecord)
        return new Json({ record: persistedRecord.data })
      }
      const [error] = this._validateData(body, schema)
      return new Json({ error }, 400)
    } catch (error) {
      if (error instanceof Error) {
        return new Json({ error: { message: error.message } }, 400)
      }
      return new Json({ error: { message: 'Unknown error' } }, 500)
    }
  }

  patch = async (request: Patch) => {
    try {
      const { body } = request
      const schema = this._getSchema({ required: false })
      if (this._validateDataType<ToUpdateData>(body, schema)) {
        const id = request.getParamOrThrow('id')
        const toUpdateRecord = this._record.update({ ...body, id })
        const persistedRecord = await this.db.update(toUpdateRecord)
        return new Json({ record: persistedRecord.data })
      }
      const [error] = this._validateData(body, schema)
      return new Json({ error }, 400)
    } catch (error) {
      if (error instanceof Error) {
        return new Json({ error: { message: error.message } }, 400)
      }
      return new Json({ error: { message: 'Unknown error' } }, 500)
    }
  }

  delete = async (request: Delete) => {
    try {
      const id = request.getParamOrThrow('id')
      await this.db.delete([new Is({ field: 'id', value: id })])
      return new Json({ id })
    } catch (error) {
      if (error instanceof Error) {
        return new Json({ error: { message: error.message } }, 400)
      }
      return new Json({ error: { message: 'Unknown error' } }, 500)
    }
  }

  private get _record() {
    const { idGenerator, templateCompiler } = this._params
    return new Record({ idGenerator, templateCompiler })
  }

  private _getSchema = (options?: { required: boolean }): JSONSchema => {
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
        field instanceof SingleLinkedRecord ||
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
      if (field instanceof MultipleLinkedRecord) {
        schema.properties[field.name] = { type: 'array', items: { type: 'string' } }
      }
      if (required && field.required) {
        schema.required.push(field.name)
      }
    }
    return schema
  }

  private _validateDataType = <T>(data: unknown, schema: JSONSchema): data is T => {
    return this._validateData(data, schema).length === 0
  }
}
