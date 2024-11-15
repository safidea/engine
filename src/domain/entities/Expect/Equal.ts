import { type BaseExpect } from './base'
import type { App } from '../App'
import type { BrowserPage } from '@domain/services/BrowserPage'
import { TestError } from '../Error/Test'
import type { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface EqualExpectConfig {
  value: string
  equal: string
}

export interface EqualExpectServices {
  templateCompiler: TemplateCompiler
}

export class EqualExpect implements BaseExpect {
  private _templateValue: Template

  constructor(
    private _config: EqualExpectConfig,
    services: EqualExpectServices
  ) {
    this._templateValue = services.templateCompiler.compile(_config.value)
  }

  execute = async (_app: App, _page: BrowserPage, context = {}) => {
    const { equal } = this._config
    const parsedValue = this._templateValue.fill(context)
    if (parsedValue !== equal) {
      throw new TestError({
        code: 'EQUAL_FAILED',
        received: parsedValue,
        expected: equal,
      })
    }
  }
}
