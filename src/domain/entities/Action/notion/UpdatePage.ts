import { BaseAction, type BaseActionConfig, type BaseActionServices } from '../base'
import type { AutomationContext } from '../../Automation/Context'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import {
  Template,
  type ConvertToTemplateObjectCompiled,
  type ConvertToTemplateObjectFilled,
} from '@domain/services/Template'
import type { Notion } from '@domain/integrations/Notion'
import type { NotionTable } from '@domain/integrations/NotionTable'
import type { NotionTablePageProperties } from '@domain/integrations/NotionTablePage'

type NotionTablePagePropertiesAsTemplateObjectCompiled =
  ConvertToTemplateObjectCompiled<NotionTablePageProperties>
type NotionTablePagePropertiesAsTemplateObjectFilled =
  ConvertToTemplateObjectFilled<NotionTablePageProperties>

export interface UpdatePageNotionActionConfig extends BaseActionConfig {
  table: string
  id: string
  page: { [key: string]: string }
}

export interface UpdatePageNotionActionServices extends BaseActionServices {
  templateCompiler: TemplateCompiler
}

export interface UpdatePageNotionActionIntegrations {
  notion: Notion
}

type Input = { id: string; page: NotionTablePagePropertiesAsTemplateObjectFilled }
type Output = NotionTablePageProperties

export class UpdatePageNotionAction extends BaseAction<Input, Output> {
  private _id: Template
  private _page: NotionTablePagePropertiesAsTemplateObjectCompiled
  private _table?: NotionTable

  constructor(
    private _config: UpdatePageNotionActionConfig,
    services: UpdatePageNotionActionServices,
    private _integrations: UpdatePageNotionActionIntegrations
  ) {
    super(_config, services)
    const { templateCompiler } = services
    this._page = templateCompiler.compileObject<NotionTablePagePropertiesAsTemplateObjectCompiled>(
      _config.page
    )
    this._id = templateCompiler.compile(_config.id)
    _integrations.notion.getConfig()
  }

  init = async () => {
    const { table } = this._config
    const { notion } = this._integrations
    this._table = await notion.getTable(table)
  }

  protected _prepare = async (context: AutomationContext) => {
    return {
      id: this._id.fill(context.data),
      page: Template.fillObject<NotionTablePagePropertiesAsTemplateObjectFilled>(
        this._page,
        context.data
      ),
    }
  }

  protected _process = async (input: Input) => {
    if (!this._table) throw new Error('Table not initialized')
    const page = await this._table.update(input.id, input.page)
    return page.properties
  }
}
