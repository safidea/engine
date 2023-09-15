import { ITemplatingSpi } from '@entities/services/templater/ITemplaterService'
import Handlebars from 'handlebars'
import { DateTime } from 'luxon'

Handlebars.registerHelper('now', function (format = 'iso') {
  const now = DateTime.now().setLocale('fr')
  if (format === 'iso') {
    return now.toISO()
  }
  return now.toFormat(format)
})

Handlebars.registerHelper('datetime_format', function (isoDate, format = 'dd/MM/yy'): string {
  const datetime = DateTime.fromISO(isoDate).setLocale('fr')
  return datetime.toFormat(format)
})

Handlebars.registerHelper('currency', function (value: number | string) {
  return Math.round(Number(value) * 100) / 100 + '€'
})

Handlebars.registerHelper('add', function (...args) {
  args.pop()
  return args.reduce((a: number, b: number | string) => Number(a) + Number(b), 0)
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
