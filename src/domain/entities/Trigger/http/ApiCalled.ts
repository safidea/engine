import type { Server } from '@domain/services/Server'
import { Json } from '@domain/entities/Response/Json'
import type { Post } from '@domain/entities/Request/Post'
import type { JSONSchema, SchemaValidator } from '@domain/services/SchemaValidator'
import type { SchemaError } from '../../Error/Schema'
import { Context } from '../../Automation/Context'
import type { Base, BaseConfig } from '../base'
import { Template, type InputValues, type OutputValue } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Monitor } from '@domain/services/Monitor'

export interface Config extends BaseConfig {
  path: string
  input?: JSONSchema
  output?: InputValues
}

export interface Services {
  server: Server
  schemaValidator: SchemaValidator
  templateCompiler: TemplateCompiler
  monitor: Monitor
}

export class ApiCalled implements Base {
  private _validateData: (json: unknown, schema: JSONSchema) => SchemaError[]
  private _output?: { [key: string]: Template }

  constructor(
    private _config: Config,
    private _services: Services
  ) {
    const { output } = this._config
    const { schemaValidator, templateCompiler } = this._services
    this._validateData = schemaValidator.validate
    this._output =
      output &&
      Object.entries(output).reduce((acc: { [key: string]: Template }, [key, { value, type }]) => {
        acc[key] = templateCompiler.compile(value, type)
        return acc
      }, {})
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
    try {
      const { input } = this._config
      const { body, path, baseUrl, headers, query, params } = request
      let context: Context
      if (!input) {
        context = await run({ path, baseUrl, headers, query, params })
      } else {
        if (this._validateDataType<object>(body, input)) {
          context = await run({ body, path, baseUrl, headers, query, params })
        } else {
          const [error] = this._validateData(body, input)
          return new Json({ error }, 400)
        }
      }
      if (this._output) {
        const response = Object.entries(this._output).reduce(
          (acc: { [key: string]: OutputValue }, [key, value]) => {
            acc[key] = context.fillTemplate(value)
            return acc
          },
          {}
        )
        return new Json(response)
      }
      return new Json({ success: true })
    } catch (error) {
      if (error instanceof Error) {
        return new Json({ error: error.message }, 400)
      }
      return new Json({ error: 'Unknown error' }, 500)
    }
  }

  private _validateDataType = <T>(data: unknown, schema: JSONSchema): data is T => {
    return this._validateData(data, schema).length === 0
  }
}
