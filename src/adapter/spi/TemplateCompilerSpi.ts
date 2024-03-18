import type { Spi } from '@domain/services/TemplateCompiler'
import { TemplateSpi, type Driver as TemplateDriver } from './TemplateSpi'

export interface Driver {
  compile: (text: string) => TemplateDriver
}

export class TemplateCompilerSpi implements Spi {
  constructor(private driver: Driver) {}

  compile = (text: string) => {
    return new TemplateSpi(this.driver.compile(text))
  }
}
