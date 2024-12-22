import type { ITemplateCompilerDriver } from '@adapter/spi/drivers/TemplateCompilerSpi'
import Handlebars from 'handlebars'
import { TemplateDriver } from './TemplateDriver'
import { parse, format } from 'date-fns'

Handlebars.registerHelper('stringify', (value) => {
  return typeof value === 'object'
    ? new Handlebars.SafeString(JSON.stringify(value))
    : String(value)
})

Handlebars.registerHelper('formatDate', (value, inputFormat, outputFormat) => {
  const parsedDate = parse(value, inputFormat, new Date())
  return format(parsedDate, outputFormat)
})

export class TemplateCompilerDriver implements ITemplateCompilerDriver {
  compile = (text: string) => {
    const processedText = text.replace(/\{\{\s*([^{}\s][^{}]*[^{}\s]?)\s*\}\}/g, (_, variable) => {
      const hasHelper = /^\s*\w+\s/.test(variable.trim())
      return hasHelper ? `{{${variable.trim()}}}` : `{{stringify ${variable.trim()}}}`
    })
    return new TemplateDriver(Handlebars.compile(processedText))
  }
}
