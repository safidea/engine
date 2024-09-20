import { Base, type BaseConfig, type BaseServices } from '../base'
import type { Context } from '../../Automation/Context'
import type { Table } from '../../Table'
import type { Template } from '@domain/services/Template'
import { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { CreatedRecord } from '@domain/entities/Record/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { RecordJson } from '@domain/entities/Record/base'

export interface Config extends BaseConfig {
  fields: Record<string, string>
  table: string
}

export interface Services extends BaseServices {
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
}

export interface Entities {
  tables: Table[]
}

type Input = Record<string, string>
type Output = RecordJson

export class CreateRecord extends Base<Input, Output> {
  private _fields: { [key: string]: Template }
  private _table: Table

  constructor(
    config: Config,
    private _services: Services,
    entities: Entities
  ) {
    super(config, _services)
    const { fields, table: tableName } = config
    const { templateCompiler } = _services
    const { tables } = entities
    this._table = this._findTableByName(tableName, tables)
    this._fields = templateCompiler.compileObject(fields)
  }

  protected _prepare = async (context: Context) => {
    return context.fillObjectTemplateAsString(this._fields)
  }

  protected _process = async (input: Input) => {
    const { idGenerator } = this._services
    const recordCreated = new CreatedRecord(input, { idGenerator })
    const recordPersisted = await this._table.db.insert(recordCreated)
    return recordPersisted.toJson()
  }
}
