import type { TemplateSpi } from '@adapter/spi/TemplateSpi'
import { Template, type InputValue, type OutputType } from './Template'

export interface Spi {
  compile: (text: string) => TemplateSpi
}

export class TemplateCompiler {
  constructor(private _spi: Spi) {}

  compile = (text: string, type: OutputType = 'string'): Template => {
    return new Template(this._spi.compile(text), type)
  }

  compileObject = (object: Record<string, string>): Record<string, Template> => {
    return Object.entries(object).reduce((acc: Record<string, Template>, [key, value]) => {
      acc[key] = this.compile(value)
      return acc
    }, {})
  }

  compileObjectWithType = (object: Record<string, InputValue>): Record<string, Template> => {
    return Object.entries(object).reduce(
      (acc: Record<string, Template>, [key, { value, type }]) => {
        acc[key] = this.compile(value, type)
        return acc
      },
      {}
    )
  }
}
