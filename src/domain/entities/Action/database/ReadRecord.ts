import { Base, type BaseConfig, type BaseServices } from '../base'
import type { Context } from '../../Automation/Context'
import type { Table } from '../../Table'
import type { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { RecordJson } from '@domain/entities/Record/base'

export interface Config extends BaseConfig {
  id: string
  table: string
}

export interface Services extends BaseServices {
  templateCompiler: TemplateCompiler
}

export interface Entities {
  tables: Table[]
}

type Input = { id: string }
type Output = RecordJson

export class ReadRecord extends Base<Input, Output> {
  private _id: Template
  private _table: Table

  constructor(config: Config, services: Services, entities: Entities) {
    super(config, services)
    const { table: tableName } = config
    const { tables } = entities
    const { templateCompiler } = services
    this._table = this._findTableByName(tableName, tables)
    this._id = templateCompiler.compile(config.id)
  }

  protected _prepare = async (context: Context) => {
    return { id: context.fillTemplateAsString(this._id) }
  }

  protected _process = async (input: Input) => {
    const recordPersisted = await this._table.db.readByIdOrThrow(input.id)
    return recordPersisted.toJson()
  }
}
