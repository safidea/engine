import Handlebars from 'handlebars'
import { DateTime } from 'luxon'
import { ITemplateDriver } from '@adapters/services/templater/ITemplaterDriver'

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

export class HandlebarsTemplater implements ITemplateDriver {
  constructor(private compiler?: HandlebarsTemplateDelegate) {}

  compile(template: string): HandlebarsTemplater {
    const compiler = Handlebars.compile(template)
    return new HandlebarsTemplater(compiler)
  }

  render(data: unknown): string {
    if (!this.compiler) {
      throw new Error('Template not compiled')
    }
    return this.compiler(data)
  }
}
