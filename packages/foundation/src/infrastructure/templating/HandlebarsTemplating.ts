import { ITemplatingSpi } from '@domain/spi/ITemplatingSpi'
import Handlebars from 'handlebars'
import { DateTime } from 'luxon'

Handlebars.registerHelper('now', function (format = 'yyyy-MM-dd HH:mm:ss') {
  const now = DateTime.now()
  return now.toFormat(format)
})

Handlebars.registerHelper('currency', function (value: number | string) {
  return Math.round(Number(value) * 100) / 100 + '€'
})

export class HandlebarsTemplating implements ITemplatingSpi {
  constructor(private compiler?: HandlebarsTemplateDelegate) {}

  compile(template: string): HandlebarsTemplating {
    const compiler = Handlebars.compile(template)
    return new HandlebarsTemplating(compiler)
  }

  render(data: unknown): string {
    if (!this.compiler) {
      throw new Error('Template not compiled')
    }
    return this.compiler(data)
  }
}
