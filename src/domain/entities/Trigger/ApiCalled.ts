import type { Server } from '@domain/services/Server'
import { Json } from '@domain/entities/Response/Json'
import type { Post } from '@domain/entities/Request/Post'
import type { JSONSchema, SchemaValidator } from '@domain/services/SchemaValidator'
import type { SchemaError } from '../Error/Schema'
import { Context } from '../Automation/Context'
import type { Base } from './base'
import { Template, type OutputFormat, type OutputParser } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Config {
  path: string
  input: Required<Pick<JSONSchema, 'properties'>>['properties']
  output: {
    [key: string]: {
      value: string
      type: OutputParser
    }
  }
}

interface Services {
  server: Server
  schemaValidator: SchemaValidator
  templateCompiler: TemplateCompiler
}

export class ApiCalled implements Base {
  private _validateData: (json: unknown, schema: JSONSchema) => SchemaError[]
  private _output: { [key: string]: Template }

  constructor(
    private _config: Config,
    private _services: Services
  ) {
    const { schemaValidator, templateCompiler } = this._services
    this._validateData = schemaValidator.validate
    this._output = Object.entries(this._config.output).reduce(
      (acc: { [key: string]: Template }, [key, { value, type }]) => {
        acc[key] = templateCompiler.compile(value, type)
        return acc
      },
      {}
    )
  }

  get path() {
    const { path } = this._config
    return `/api/automation/${path}`
  }

  init = async (run: (triggerData: object) => Promise<Context>) => {
    const { server } = this._services
    await server.post(this.path, (request: Post) => this.post(request, run))
  }

  post = async (request: Post, run: (data: object) => Promise<Context>) => {
    const { input } = this._config
    const { body, path, baseUrl, headers, query, params } = request
    const schema: JSONSchema = { type: 'object', properties: input, required: Object.keys(input) }
    if (this._validateDataType<object>(body, schema)) {
      const context = await run({ body, path, baseUrl, headers, query, params })
      const response = Object.entries(this._output).reduce(
        (acc: { [key: string]: OutputFormat }, [key, value]) => {
          acc[key] = context.fillTemplate(value)
          return acc
        },
        {}
      )
      return new Json({ success: true, response })
    }
    const [error] = this._validateData(body, schema)
    return new Json({ error }, 400)
  }

  private _validateDataType = <T>(data: unknown, schema: JSONSchema): data is T => {
    return this._validateData(data, schema).length === 0
  }
}
