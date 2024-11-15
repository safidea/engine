import { BaseAction, type BaseActionConfig, type BaseActionServices } from '../base'
import type { AutomationContext } from '../../Automation/Context'
import { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { PappersEntreprise, Pappers } from '@domain/integrations/Pappers'

export interface GetCompanyPappersActionConfig extends BaseActionConfig {
  siret: string
}

export interface GetCompanyPappersActionServices extends BaseActionServices {
  templateCompiler: TemplateCompiler
}

export interface GetCompanyPappersActionIntegrations {
  pappers: Pappers
}

type Input = { siret: string }
type Output = PappersEntreprise

export class GetCompanyPappersAction extends BaseAction<Input, Output> {
  private _siret: Template

  constructor(
    config: GetCompanyPappersActionConfig,
    services: GetCompanyPappersActionServices,
    private _integrations: GetCompanyPappersActionIntegrations
  ) {
    super(config, services)
    const { siret } = config
    const { templateCompiler } = services
    this._siret = templateCompiler.compile(siret)
    _integrations.pappers.config()
  }

  protected _prepare = async (context: AutomationContext) => {
    return { siret: context.fillTemplateAsString(this._siret) }
  }

  protected _process = async (input: Input) => {
    const company = await this._integrations.pappers.getCompany(input.siret)
    if (!company) {
      throw new Error(`Company not found for siret "${input.siret}"`)
    }
    return company
  }
}
