import type { Driver } from '@adapter/spi/TemplateCompilerSpi'
import Handlebars from 'handlebars'
import { TemplateDriver } from './TemplateDriver'

export class TemplateCompilerDriver implements Driver {
  compile = (text: string) => {
    const template = Handlebars.compile(text)
    return new TemplateDriver(template)
  }
}
