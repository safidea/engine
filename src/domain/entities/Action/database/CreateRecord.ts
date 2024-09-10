import { Base, type BaseConfig } from '../base'
import type { Context } from '../../Automation/Context'
import type { Table } from '../../Table'
import type { Template } from '@domain/services/Template'
import { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { CreatedRecord } from '@domain/entities/Record/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'

export interface Config extends BaseConfig {
  fields: { [key: string]: string }
  table: string
}

export interface Services {
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
}

export interface Entities {
  tables: Table[]
}

export class CreateRecord extends Base {
  private _fields: { [key: string]: Template }
  private _table: Table

  constructor(
    config: Config,
    private _services: Services,
    entities: Entities
  ) {
    super(config)
    const { fields, table: tableName } = config
    const { templateCompiler } = _services
    const { tables } = entities
    this._table = this._findTableByName(tableName, tables)
    this._fields = templateCompiler.compileObject(fields)
  }

  execute = async (context: Context) => {
    const { idGenerator } = this._services
    const data = context.fillObjectTemplateAsString(this._fields)
    const recordCreated = new CreatedRecord(data, { idGenerator })
    const recordPersisted = await this._table.db.insert(recordCreated)
    context.set(this.name, recordPersisted.toJson())
  }
}
