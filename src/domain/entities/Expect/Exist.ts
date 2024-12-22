import { type BaseExpect } from './base'
import type { StartedApp } from '../App/Started'
import type { BrowserPage } from '@domain/services/BrowserPage'
import { TestError } from '../Error/Test'
import type { Template } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface ExistExpectConfig {
  value: string
}

export interface ExistExpectServices {
  templateCompiler: TemplateCompiler
}

export class ExistExpect implements BaseExpect {
  private _templateValue: Template

  constructor(config: ExistExpectConfig, services: ExistExpectServices) {
    this._templateValue = services.templateCompiler.compile(config.value)
  }

  execute = async (_app: StartedApp, _page: BrowserPage, context = {}) => {
    const parsedValue = this._templateValue.fill(context)
    if (!parsedValue) {
      throw new TestError({
        code: 'EXIST_FAILED',
      })
    }
  }
}
