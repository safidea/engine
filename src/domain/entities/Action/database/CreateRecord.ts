import { BaseAction, type BaseActionConfig, type BaseActionServices } from '../base'
import type { AutomationContext } from '../../Automation/Context'
import type { Table } from '../../Table'
import { Template, type TemplateObjectCompiled } from '@domain/services/Template'
import { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { CreatedRecord } from '@domain/entities/Record/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { RecordJson } from '@domain/entities/Record/base'

export interface CreateRecordDatabaseActionConfig extends BaseActionConfig {
  fields: { [key: string]: string }
  table: string
}

export interface CreateRecordDatabaseActionServices extends BaseActionServices {
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
}

export interface CreateRecordDatabaseActionEntities {
  tables: Table[]
}

type Input = { [key: string]: string }
type Output = { record: RecordJson }

export class CreateRecordDatabaseAction extends BaseAction<Input, Output> {
  private _fields: TemplateObjectCompiled
  private _table: Table

  constructor(
    config: CreateRecordDatabaseActionConfig,
    private _services: CreateRecordDatabaseActionServices,
    entities: CreateRecordDatabaseActionEntities
  ) {
    super(config, _services)
    const { fields, table: tableName } = config
    const { templateCompiler } = _services
    const { tables } = entities
    this._table = this._findTableByName(tableName, tables)
    this._fields = templateCompiler.compileObject(fields)
  }

  protected _prepare = async (context: AutomationContext) => {
    return Template.fillObject<{ [key: string]: string }>(this._fields, context.data)
  }

  protected _process = async (input: Input) => {
    const { idGenerator } = this._services
    const recordCreated = new CreatedRecord(input, { idGenerator })
    const recordPersisted = await this._table.db.insert(recordCreated)
    return { record: recordPersisted.toJson() }
  }
}
