import type { Context } from '@domain/engine/automation/Context'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface Data {
  id: string
  created_at: Date
  [key: string]: string | number | boolean | Date | undefined
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
  private templates: TemplateKey[]

  constructor(
    data: Partial<Data>,
    private params: Params
  ) {
    const { idGenerator, templateCompiler } = params
    this.templates = Object.keys(data).reduce((acc: TemplateKey[], key) => {
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

  fillWithContext(context: Context): ToCreate {
    const data = {
      ...this.data,
      ...this.templates.reduce((acc: { [key: string]: string }, { key, template }) => {
        acc[key] = context.fillTemplate(template)
        return acc
      }, {}),
    }
    return new ToCreate(data, this.params)
  }
}
