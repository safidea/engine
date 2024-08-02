import type { DatabaseTable } from '@domain/services/DatabaseTable'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Logger } from '@domain/services/Logger'
import type { Field } from '../Field'
import { Record } from '@domain/entities/Record'
import type { Data as ToCreateData } from '@domain/entities/Record/ToCreate'
import type { Data as ToUpdateData } from '@domain/entities/Record/ToUpdate'
import type { Data as PersistedData } from '@domain/entities/Record/Persisted'
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
import { FilterMapper, schema as filtersSchema, type Config as FilterConfig } from '../Filter'

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

  get record() {
    const { idGenerator, templateCompiler } = this._params
    return new Record({ idGenerator, templateCompiler, fields: this.fields })
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

  read = async (id: string): Promise<PersistedData | undefined> => {
    const record = await this.db.readById(id)
    return record ? { ...record.data, id: record.id } : undefined
  }

  get = async (request: Get) => {
    const id = request.getParamOrThrow('id')
    const record = await this.read(id)
    return new Json({ record })
  }

  list = async (
    filtersConfig: unknown = []
  ): Promise<
    { records: PersistedData[]; error?: undefined } | { records?: undefined; error: SchemaError }
  > => {
    if (this._validateDataType<FilterConfig[]>(filtersConfig, filtersSchema)) {
      const filters = FilterMapper.toManyEntities(filtersConfig)
      const records = await this.db.list(filters)
      return { records: records.map((record) => record.data) }
    }
    const [error] = this._validateData(filtersConfig, filtersSchema)
    return { error }
  }

  getAll = async () => {
    const { records, error } = await this.list()
    return new Json({ records, error }, error ? 400 : 200)
  }

  insert = async (
    data: unknown
  ): Promise<
    { record: PersistedData; error?: undefined } | { record?: undefined; error: SchemaError }
  > => {
    const schema = this._getRecordSchema()
    if (this._validateDataType<ToCreateData>(data, schema)) {
      const toCreateRecord = this.record.create(data)
      const persistedRecord = await this.db.insert(toCreateRecord)
      return { record: persistedRecord.data }
    }
    const [error] = this._validateData(data, schema)
    return { error }
  }

  post = async (request: Post) => {
    try {
      const { body } = request
      const { record, error } = await this.insert(body)
      return new Json({ record, error }, error ? 400 : 201)
    } catch (error) {
      if (error instanceof Error) {
        return new Json({ error: { message: error.message } }, 400)
      }
      return new Json({ error: { message: 'Unknown error' } }, 500)
    }
  }

  update = async (
    id: string,
    data: unknown
  ): Promise<
    { record: PersistedData; error?: undefined } | { record?: undefined; error: SchemaError }
  > => {
    const schema = this._getRecordSchema({ required: false })
    if (this._validateDataType<ToUpdateData>(data, schema)) {
      const toUpdateRecord = this.record.update({ ...data, id })
      const persistedRecord = await this.db.update(toUpdateRecord)
      return { record: persistedRecord.data }
    }
    const [error] = this._validateData(data, schema)
    return { error }
  }

  patch = async (request: Patch) => {
    try {
      const { body } = request
      const id = request.getParamOrThrow('id')
      const { record, error } = await this.update(id, body)
      return new Json({ record, error }, error ? 400 : 204)
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

  private _getRecordSchema = (options?: { required: boolean }): JSONSchema => {
    const { required = true } = options || {}
    const schema: JSONSchema = {
      type: 'object',
      properties: {},
      required: [],
    }
    if (schema.properties && schema.required) {
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
    }
    return schema
  }

  private _validateDataType = <T>(data: unknown, schema: JSONSchema): data is T => {
    return this._validateData(data, schema).length === 0
  }
}
