import { Base, type BaseConfig } from '../base'
import type { Context } from '../../Automation/Context'
import type { Table } from '../../Table'
import type { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface Config extends BaseConfig {
  id: string
  table: string
}

export interface Services {
  templateCompiler: TemplateCompiler
}

export interface Entities {
  tables: Table[]
}

export class ReadRecord extends Base {
  private _id: Template
  private _table: Table

  constructor(config: Config, services: Services, entities: Entities) {
    super(config)
    const { table: tableName } = config
    const { tables } = entities
    const { templateCompiler } = services
    this._table = this._findTableByName(tableName, tables)
    this._id = templateCompiler.compile(config.id)
  }

  execute = async (context: Context) => {
    const id = context.fillTemplateAsString(this._id)
    const recordPersisted = await this._table.db.readById(id)
    context.set(this.name, recordPersisted?.toJson() ?? {})
  }
}
