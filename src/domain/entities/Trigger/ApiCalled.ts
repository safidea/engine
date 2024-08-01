import type { Queue } from '@domain/services/Queue'
import type { Server } from '@domain/services/Server'
import { Json } from '@domain/entities/Response/Json'
import type { Post } from '@domain/entities/Request/Post'
import type { JSONSchema, SchemaValidator } from '@domain/services/SchemaValidator'
import type { SchemaError } from '../Error/Schema'

interface Config {
  automation: string
  path: string
  input: JSONSchema
  output: { [key: string]: string | number | boolean }
}

type Input =
  | string
  | number
  | boolean
  | { [key: string]: Input }
  | (string | number | boolean | { [key: string]: Input })[]

interface Services {
  server: Server
  queue: Queue
  schemaValidator: SchemaValidator
}

export class ApiCalled {
  private _validateData: (json: unknown, schema: JSONSchema) => SchemaError[]

  constructor(
    private _config: Config,
    private _services: Services
  ) {
    const { schemaValidator } = this._services
    this._validateData = schemaValidator.validate
  }

  get path() {
    const { path } = this._config
    return `/api/automation/${path}`
  }

  init = async () => {
    const { server } = this._services
    await server.post(this.path, this.post)
  }

  post = async (request: Post) => {
    const { queue } = this._services
    const { automation, input } = this._config
    const { body, path, baseUrl, headers, query, params } = request
    if (this._validateDataType<Input>(body, input)) {
      const jobId = await queue.add(automation, {
        path,
        baseUrl,
        body,
        headers,
        query,
        params,
      })
      //const context = await queue.waitFor({ id: jobId, state: 'completed' })
      return new Json({ success: true, id: jobId })
    }
    const [error] = this._validateData(body, input)
    return new Json({ error }, 400)
  }

  private _validateDataType = <T>(data: unknown, schema: JSONSchema): data is T => {
    return this._validateData(data, schema).length === 0
  }
}
