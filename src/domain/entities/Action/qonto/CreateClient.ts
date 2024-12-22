import { BaseAction, type BaseActionConfig, type BaseActionServices } from '../base'
import type { AutomationContext } from '../../Automation/Context'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { QontoCreateClient, QontoClient, Qonto } from '@domain/integrations/Qonto'
import {
  Template,
  type ConvertToTemplateObject,
  type ConvertToTemplateObjectCompiled,
  type ConvertToTemplateObjectFilled,
} from '@domain/services/Template'

type QontoCreateClientAsTemplateObject = ConvertToTemplateObject<QontoCreateClient>
type QontoCreateClientAsTemplateObjectCompiled = ConvertToTemplateObjectCompiled<QontoCreateClient>
type QontoCreateClientAsTemplateObjectFilled = ConvertToTemplateObjectFilled<QontoCreateClient>

export interface CreateClientQontoActionConfig extends BaseActionConfig {
  client: QontoCreateClientAsTemplateObject
}

export interface CreateClientQontoActionServices extends BaseActionServices {
  templateCompiler: TemplateCompiler
}

export interface CreateClientQontoActionIntegrations {
  qonto: Qonto
}

type Input = { client: QontoCreateClient }
type Output = QontoClient

export class CreateClientQontoAction extends BaseAction<Input, Output> {
  private _client: QontoCreateClientAsTemplateObjectCompiled

  constructor(
    config: CreateClientQontoActionConfig,
    services: CreateClientQontoActionServices,
    private _integrations: CreateClientQontoActionIntegrations
  ) {
    super(config, services)
    const { client } = config
    const { templateCompiler } = services
    this._client = templateCompiler.compileObject<QontoCreateClientAsTemplateObjectCompiled>(client)
    _integrations.qonto.getConfig()
  }

  protected _prepare = async (context: AutomationContext) => {
    return {
      client: Template.fillObject<QontoCreateClientAsTemplateObjectFilled>(
        this._client,
        context.data
      ),
    }
  }

  protected _process = async (input: Input) => {
    return this._integrations.qonto.createClient(input.client)
  }
}
