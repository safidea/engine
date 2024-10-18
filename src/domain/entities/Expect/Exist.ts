import { type Base } from './base'
import type { App } from '../App'
import type { BrowserPage } from '@domain/services/BrowserPage'
import { TestError } from '../Error/Test'
import type { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface Config {
  value: string
}

export interface Services {
  templateCompiler: TemplateCompiler
}

export class Exist implements Base {
  private _templateValue: Template

  constructor(config: Config, services: Services) {
    this._templateValue = services.templateCompiler.compile(config.value)
  }

  execute = async (_app: App, _page: BrowserPage, context = {}) => {
    const parsedValue = this._templateValue.fill(context)
    if (!parsedValue) {
      throw new TestError({
        code: 'EXIST_FAILED',
      })
    }
  }
}
