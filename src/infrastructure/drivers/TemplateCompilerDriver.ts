import type { ITemplateCompilerDriver } from '@adapter/spi/drivers/TemplateCompilerSpi'
import Handlebars from 'handlebars'
import { TemplateDriver } from './TemplateDriver'

Handlebars.registerHelper('stringify', function (context) {
  if (typeof context === 'number') {
    return context.toString()
  }
  if (typeof context === 'boolean') {
    return context ? 'true' : 'false'
  }
  if (Array.isArray(context) || typeof context === 'object') {
    return new Handlebars.SafeString(JSON.stringify(context))
  }
  return context
})

export class TemplateCompilerDriver implements ITemplateCompilerDriver {
  compile = (text: string) => {
    const stringifiedText = this._replaceAllWithStringify(text)
    const template = Handlebars.compile(stringifiedText)
    return new TemplateDriver(template)
  }

  private _replaceAllWithStringify = (inputString: string) => {
    const regex = /\{\{\s*([^{}\s][^{}]*[^{}\s]?)\s*\}\}/g
    const replacedString = inputString.replace(regex, (_match, p1) => `{{stringify ${p1}}}`)
    return replacedString
  }
}
