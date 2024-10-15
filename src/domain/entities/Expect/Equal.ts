import { type Base, type BaseServices } from './base'
import type { App } from '../App'
import type { BrowserPage } from '@domain/services/BrowserPage'
import { TestError } from '../Error/Test'
import type { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface Config {
  value: string
  expected: string
}

export interface Services extends BaseServices {
  templateCompiler: TemplateCompiler
}

export class Equal implements Base {
  private _templateValue: Template

  constructor(
    private _config: Config,
    private _services: Services
  ) {
    this._templateValue = _services.templateCompiler.compile(_config.value)
  }

  execute = async (_app: App, _page: BrowserPage, context = {}) => {
    const { expected } = this._config
    const { logger } = this._services
    const parsedValue = this._templateValue.fill(context)
    logger.debug(`checking if value "${parsedValue}" equals "${expected}"`)
    if (parsedValue !== expected) {
      throw new TestError({
        code: 'EQUAL_FAILED',
        received: parsedValue,
        expected,
      })
    }
  }
}
