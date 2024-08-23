import type { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Context } from '../Automation/Context'

export interface Data {
  id: string
  name: string
  file_data: Buffer
  created_at: Date
}

interface TemplateKey {
  key: string
  template: Template
}

export interface Params {
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
}

export class ToSave {
  public data: Data
  private _templates: TemplateKey[]

  constructor(
    data: Omit<Data, 'id' | 'created_at'>,
    private _params: Params
  ) {
    const { idGenerator, templateCompiler } = _params
    this._templates = [
      {
        key: 'name',
        template: templateCompiler.compile(data.name),
      },
    ]
    this.data = {
      id: idGenerator.forFile(),
      created_at: new Date(),
      ...data,
    }
  }

  get id(): string {
    return this.data.id
  }

  fillWithContext(context: Context): ToSave {
    const data = {
      ...this.data,
      ...this._templates.reduce((acc: { [key: string]: string }, { key, template }) => {
        acc[key] = context.fillTemplateAsString(template)
        return acc
      }, {}),
    }
    return new ToSave(data, this._params)
  }
}
