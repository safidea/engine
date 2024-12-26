import type { DatabaseTable } from '@domain/services/DatabaseTable'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Field } from '../Field'
import { JsonResponse } from '@domain/entities/Response/Json'
import type { PostRequest } from '@domain/entities/Request/Post'
import type { PatchRequest } from '@domain/entities/Request/Patch'
import type { GetRequest } from '@domain/entities/Request/Get'
import type { DeleteRequest } from '@domain/entities/Request/Delete'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { JSONSchema, SchemaValidator } from '@domain/services/SchemaValidator'
import type { SchemaError } from '../Error/Schema'
import { SingleSelectField } from '../Field/SingleSelect'
import { SingleLineTextField } from '../Field/SingleLineText'
import { LongTextField } from '../Field/LongText'
import { EmailField } from '../Field/Email'
import { NumberField } from '../Field/Number'
import { DateTimeField } from '../Field/DateTime'
import { SingleLinkedRecordField } from '../Field/SingleLinkedRecord'
import { MultipleLinkedRecordField } from '../Field/MultipleLinkedRecord'
import { FilterMapper, filterSchema, type FilterConfig } from '../Filter'
import type { Monitor } from '@domain/services/Monitor'
import type { Record, RecordFieldsConfig } from '../Record'

interface TableConfig {
  name: string
}

interface TableServices {
  server: Server
  database: Database
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  schemaValidator: SchemaValidator
  monitor: Monitor
}

interface TableEntites {
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
    config: TableConfig,
    private _services: TableServices,
    entities: TableEntites
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
      if (field instanceof SingleLinkedRecordField || field instanceof MultipleLinkedRecordField) {
        dependancies.push(field.table)
      }
    }
    return dependancies.filter((value, index, self) => self.indexOf(value) === index)
  }

  read = async (filterConfig: FilterConfig): Promise<Record | undefined> => {
    const filter = FilterMapper.toEntity(filterConfig)
    return this.db.read(filter)
  }

  readById = async (id: string): Promise<Record | undefined> => {
    return this.db.readById(id)
  }

  get = async (request: GetRequest) => {
    const id = request.getParamOrThrow('id')
    const record = await this.readById(id)
    return new JsonResponse({ record }, record ? 200 : 404)
  }

  list = async (
    filterConfig?: unknown
  ): Promise<
    { records: Record[]; error?: undefined } | { records?: undefined; error: SchemaError }
  > => {
    if (!filterConfig) {
      const records = await this.db.list()
      return { records }
    } else if (this._validateDataType<FilterConfig>(filterConfig, filterSchema)) {
      const filter = FilterMapper.toEntity(filterConfig)
      const records = await this.db.list(filter)
      return { records }
    }
    const [error] = this._validateData(filterConfig, filterSchema)
    return { error }
  }

  getAll = async () => {
    const { records, error } = await this.list()
    return new JsonResponse({ records, error }, error ? 400 : 200)
  }

  insert = async (
    data: unknown
  ): Promise<
    { record: Record; error?: undefined } | { record?: undefined; error: SchemaError }
  > => {
    const schema = this._getRecordSchema()
    if (this._validateDataType<RecordFieldsConfig>(data, schema)) {
      const record = await this.db.insert(data)
      return { record }
    }
    const [error] = this._validateData(data, schema)
    return { error }
  }

  post = async (request: PostRequest) => {
    try {
      const { body } = request
      const { record, error } = await this.insert(body)
      return new JsonResponse({ record, error }, error ? 400 : 201)
    } catch (error) {
      if (error instanceof Error) {
        this._services.monitor.captureException(error)
        return new JsonResponse({ error: { message: error.message } }, 400)
      }
      return new JsonResponse({ error: { message: 'Unknown error' } }, 500)
    }
  }

  update = async (
    id: string,
    data: unknown
  ): Promise<
    { record: Record; error?: undefined } | { record?: undefined; error: SchemaError }
  > => {
    const schema = this._getRecordSchema({ required: false })
    if (this._validateDataType<RecordFieldsConfig>(data, schema)) {
      const record = await this.db.update(id, data)
      return { record }
    }
    const [error] = this._validateData(data, schema)
    return { error }
  }

  patch = async (request: PatchRequest) => {
    try {
      const { body } = request
      const id = request.getParamOrThrow('id')
      const { record, error } = await this.update(id, body)
      return new JsonResponse({ record, error }, error ? 400 : 204)
    } catch (error) {
      if (error instanceof Error) {
        this._services.monitor.captureException(error)
        return new JsonResponse({ error: { message: error.message } }, 400)
      }
      return new JsonResponse({ error: { message: 'Unknown error' } }, 500)
    }
  }

  delete = async (request: DeleteRequest) => {
    try {
      const id = request.getParamOrThrow('id')
      await this.db.delete(id)
      return new JsonResponse({ id })
    } catch (error) {
      if (error instanceof Error) {
        return new JsonResponse({ error: { message: error.message } }, 400)
      }
      return new JsonResponse({ error: { message: 'Unknown error' } }, 500)
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
        if (field instanceof SingleSelectField) {
          schema.properties[field.name] = {
            type: 'string',
            enum: field.options,
          }
        }
        if (
          field instanceof SingleLinkedRecordField ||
          field instanceof SingleLineTextField ||
          field instanceof LongTextField ||
          field instanceof EmailField ||
          field instanceof DateTimeField
        ) {
          schema.properties[field.name] = { type: 'string' }
        }
        if (field instanceof NumberField) {
          schema.properties[field.name] = { type: 'number' }
        }
        if (field instanceof MultipleLinkedRecordField) {
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
