import type { ITemplateCompilerSpi } from '@domain/services/TemplateCompiler'
import { TemplateSpi, type ITemplateDriver } from './TemplateSpi'

export interface ITemplateCompilerDriver {
  compile: (text: string) => ITemplateDriver
}

export class TemplateCompilerSpi implements ITemplateCompilerSpi {
  constructor(private _driver: ITemplateCompilerDriver) {}

  compile = (text: string) => {
    return new TemplateSpi(this._driver.compile(text))
  }
}
