import type { ITemplateCompilerDriver } from '@adapter/spi/drivers/TemplateCompilerSpi'
import Handlebars from 'handlebars'
import { TemplateDriver } from './TemplateDriver'

Handlebars.registerHelper('stringify', (context) =>
  typeof context === 'object' ? new Handlebars.SafeString(JSON.stringify(context)) : String(context)
)

export class TemplateCompilerDriver implements ITemplateCompilerDriver {
  compile = (text: string) => {
    const stringifiedText = text.replace(
      /\{\{\s*([^{}\s][^{}]*[^{}\s]?)\s*\}\}/g,
      `{{stringify $1}}`
    )
    return new TemplateDriver(Handlebars.compile(stringifiedText))
  }
}
