import type { DatabaseTable } from '@domain/services/DatabaseTable'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Field } from '../Field'
import { Json } from '@domain/entities/Response/Json'
import type { Post } from '@domain/entities/Request/Post'
import type { Patch } from '@domain/entities/Request/Patch'
import type { Get } from '@domain/entities/Request/Get'
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
import { CreatedRecord } from '../Record/Created'
import { UpdatedRecord } from '../Record/Updated'
import type { BaseRecordFields, RecordJson } from '../Record/base'
import type { Monitor } from '@domain/services/Monitor'

interface Config {
  name: string
}

interface Services {
  server: Server
  database: Database
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  schemaValidator: SchemaValidator
  monitor: Monitor
}

interface Entites {
  fields: Field[]
}

export class Table {
  readonly name: string
  readonly fields: Field[]
  readonly path: string
  readonly recordPath: string
  readonly db: DatabaseTable
  private _validateData: (json: unknown, schema: JSONSchema) => SchemaError[]

  constructor(
    config: Config,
    private _services: Services,
    entities: Entites
  ) {
    const { name } = config
    const { database, schemaValidator } = _services
    const { fields } = entities
    this.name = name
    this.fields = fields
    this.path = `/api/table/${this.name}`
    this.recordPath = `${this.path}/:id`
    this.db = database.table(this.name, this.fields)
    this._validateData = schemaValidator.validate
  }

  init = async () => {
    const { server } = this._services
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

  readById = async (id: string): Promise<RecordJson | undefined> => {
    const record = await this.db.readById(id)
    return record ? record.toJson() : undefined
  }

  get = async (request: Get) => {
    const id = request.getParamOrThrow('id')
    const record = await this.readById(id)
    return new Json({ record })
  }

  list = async (
    filtersConfig: unknown = []
  ): Promise<
    { records: RecordJson[]; error?: undefined } | { records?: undefined; error: SchemaError }
  > => {
    if (this._validateDataType<FilterConfig[]>(filtersConfig, filtersSchema)) {
      const filters = FilterMapper.toManyEntities(filtersConfig)
      const records = await this.db.list(filters)
      return { records: records.map((record) => record.toJson()) }
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
    { record: RecordJson; error?: undefined } | { record?: undefined; error: SchemaError }
  > => {
    const schema = this._getRecordSchema()
    if (this._validateDataType<BaseRecordFields>(data, schema)) {
      const toCreateRecord = new CreatedRecord(data, { idGenerator: this._services.idGenerator })
      const persistedRecord = await this.db.insert(toCreateRecord)
      return { record: persistedRecord.toJson() }
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
        this._services.monitor.captureException(error)
        return new Json({ error: { message: error.message } }, 400)
      }
      return new Json({ error: { message: 'Unknown error' } }, 500)
    }
  }

  update = async (
    id: string,
    data: unknown
  ): Promise<
    { record: RecordJson; error?: undefined } | { record?: undefined; error: SchemaError }
  > => {
    const schema = this._getRecordSchema({ required: false })
    if (this._validateDataType<Omit<BaseRecordFields, 'id'>>(data, schema)) {
      const updatedRecord = new UpdatedRecord({ id, ...data })
      const persistedRecord = await this.db.update(updatedRecord)
      return { record: persistedRecord.toJson() }
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
        this._services.monitor.captureException(error)
        return new Json({ error: { message: error.message } }, 400)
      }
      return new Json({ error: { message: 'Unknown error' } }, 500)
    }
  }

  delete = async (request: Delete) => {
    try {
      const id = request.getParamOrThrow('id')
      await this.db.delete(id)
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
