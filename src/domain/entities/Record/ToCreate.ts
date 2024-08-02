import type { Context } from '@domain/entities/Automation/Context'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export type DataType = string | number | boolean | Date | undefined | string[]

export interface Data {
  id: string
  created_at: Date
  [key: string]: DataType
}

interface TemplateKey {
  key: string
  template: Template
}

export interface Params {
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
}

export class ToCreate {
  public data: Data
  private _templates: TemplateKey[]

  constructor(
    data: Partial<Data>,
    private _params: Params
  ) {
    const { idGenerator, templateCompiler } = _params
    this._templates = Object.keys(data).reduce((acc: TemplateKey[], key) => {
      const value = data[key]
      if (typeof value === 'string') {
        acc.push({ key, template: templateCompiler.compile(value) })
      }
      return acc
    }, [])
    this.data = {
      ...data,
      id: idGenerator.forRecord(),
      created_at: new Date(),
    }
  }

  get id(): string {
    return this.data.id
  }

  fillWithContext(context: Context): ToCreate {
    const data = {
      ...this.data,
      ...this._templates.reduce((acc: { [key: string]: string }, { key, template }) => {
        acc[key] = context.fillTemplateAsString(template)
        return acc
      }, {}),
    }
    return new ToCreate(data, this._params)
  }
}
