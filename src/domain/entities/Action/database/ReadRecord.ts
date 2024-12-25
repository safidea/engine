import { BaseAction, type BaseActionConfig, type BaseActionServices } from '../base'
import type { AutomationContext } from '../../Automation/Context'
import type { Table } from '../../Table'
import type { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { JsonRecordFields } from '@domain/entities/Record/base'

export interface ReadRecordDatabaseActionConfig extends BaseActionConfig {
  id: string
  table: string
}

export interface ReadRecordDatabaseActionServices extends BaseActionServices {
  templateCompiler: TemplateCompiler
}

export interface ReadRecordDatabaseActionEntities {
  tables: Table[]
}

type Input = { id: string }
type Output = { record: JsonRecordFields }

export class ReadRecordDatabaseAction extends BaseAction<Input, Output> {
  private _id: Template
  private _table: Table

  constructor(
    config: ReadRecordDatabaseActionConfig,
    services: ReadRecordDatabaseActionServices,
    entities: ReadRecordDatabaseActionEntities
  ) {
    super(config, services)
    const { table: tableName } = config
    const { tables } = entities
    const { templateCompiler } = services
    this._table = this._findTableByName(tableName, tables)
    this._id = templateCompiler.compile(config.id)
  }

  protected _prepare = async (context: AutomationContext) => {
    return { id: this._id.fill(context.data) }
  }

  protected _process = async (input: Input) => {
    const recordPersisted = await this._table.db.readByIdOrThrow(input.id)
    return { record: recordPersisted.toJson() }
  }
}
