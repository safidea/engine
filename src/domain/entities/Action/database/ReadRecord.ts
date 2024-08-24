import { Base, type Params as BaseParams, type Interface } from '../base'
import type { Context } from '../../Automation/Context'
import type { Table } from '../../Table'
import type { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Params extends BaseParams {
  table: Table
  id: string
  templateCompiler: TemplateCompiler
}

export class ReadRecord extends Base implements Interface {
  private _id: Template

  constructor(private _params: Params) {
    super(_params)
    const { templateCompiler } = _params
    this._id = templateCompiler.compile(_params.id)
  }

  execute = async (context: Context) => {
    const { table } = this._params
    const id = context.fillTemplate(this._id).toString()
    const recordPersisted = await table.db.readById(id)
    context.set(this.name, recordPersisted?.data ?? {})
  }
}
