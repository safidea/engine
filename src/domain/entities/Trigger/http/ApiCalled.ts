import type { Server } from '@domain/services/Server'
import { JsonResponse } from '@domain/entities/Response/Json'
import type { PostRequest } from '@domain/entities/Request/Post'
import type { JSONSchema, SchemaValidator } from '@domain/services/SchemaValidator'
import type { SchemaError } from '../../Error/Schema'
import { AutomationContext } from '../../Automation/Context'
import type { BaseTrigger, BaseTriggerConfig } from '../base'
import {
  Template,
  type TemplateObject,
  type TemplateObjectCompiled,
} from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Monitor } from '@domain/services/Monitor'

export interface ApiCalledHttpTriggerConfig extends BaseTriggerConfig {
  path: string
  input?: JSONSchema
  output?: TemplateObject
}

export interface ApiCalledHttpTriggerServices {
  server: Server
  schemaValidator: SchemaValidator
  templateCompiler: TemplateCompiler
  monitor: Monitor
}

export class ApiCalledHttpTrigger implements BaseTrigger {
  private _validateData: (json: unknown, schema: JSONSchema) => SchemaError[]
  private _output?: TemplateObjectCompiled

  constructor(
    private _config: ApiCalledHttpTriggerConfig,
    private _services: ApiCalledHttpTriggerServices
  ) {
    const { output } = this._config
    const { schemaValidator, templateCompiler } = this._services
    this._validateData = schemaValidator.validate
    this._output = output ? templateCompiler.compileObject(output) : undefined
  }

  get path() {
    const { path } = this._config
    return `/api/automation/${path}`
  }

  init = async (run: (triggerData: object) => Promise<AutomationContext>) => {
    const { server } = this._services
    await server.post(this.path, (request: PostRequest) => this.post(request, run))
  }

  post = async (request: PostRequest, run: (data: object) => Promise<AutomationContext>) => {
    try {
      const { input } = this._config
      const { body, path, baseUrl, headers, query, params } = request
      let context: AutomationContext
      if (!input) {
        context = await run({ path, baseUrl, headers, query, params })
      } else {
        if (this._validateDataType<object>(body, input)) {
          context = await run({ body, path, baseUrl, headers, query, params })
        } else {
          const [error] = this._validateData(body, input)
          return new JsonResponse({ error }, 400)
        }
      }
      if (context.status === 'failed') {
        return new JsonResponse({ error: context.error }, 400)
      }
      if (this._output) {
        const response = Template.fillObject(this._output, context.data)
        return new JsonResponse(response)
      }
      return new JsonResponse({ success: true })
    } catch (error) {
      if (error instanceof Error) {
        return new JsonResponse({ error: error.message }, 400)
      }
      return new JsonResponse({ error: 'Unknown error' }, 500)
    }
  }

  private _validateDataType = <T>(data: unknown, schema: JSONSchema): data is T => {
    return this._validateData(data, schema).length === 0
  }
}
