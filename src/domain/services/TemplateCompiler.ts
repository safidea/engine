import type { TemplateSpi } from '@adapter/spi/TemplateSpi'
import { Template } from './Template'

export interface Spi {
  compile: (text: string) => TemplateSpi
}

export class TemplateCompiler {
  constructor(private spi: Spi) {}

  compile = (text: string): Template => {
    return new Template(this.spi.compile(text))
  }
}
