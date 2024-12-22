import type { TemplateSpi } from '@adapter/spi/drivers/TemplateSpi'
import {
  isTemplateBooleanValue,
  isTemplateJsonValue,
  isTemplateNumberValue,
  Template,
  type TemplateObject,
  type TemplateObjectCompiled,
} from './Template'

export interface ITemplateCompilerSpi {
  compile: (text: string) => TemplateSpi
}

export class TemplateCompiler {
  constructor(private _spi: ITemplateCompilerSpi) {}

  compile = (text: string): Template => {
    return new Template(this._spi.compile(text))
  }

  compileObject = <T extends TemplateObjectCompiled>(object: TemplateObject): T => {
    const result: TemplateObjectCompiled = {}
    for (const key in object) {
      const value = object[key]
      if (typeof value === 'string') {
        result[key] = this.compile(value)
      } else if (isTemplateNumberValue(value)) {
        result[key] = { number: this.compile(value.number) }
      } else if (isTemplateBooleanValue(value)) {
        result[key] = { boolean: this.compile(value.boolean) }
      } else if (isTemplateJsonValue(value)) {
        result[key] = { json: this.compile(value.json) }
      } else if (value) {
        result[key] = this.compileObject(value)
      }
    }
    return result as T
  }
}
