import type { TemplateSpi } from '@adapter/spi/drivers/TemplateSpi'
import { Template, type TemplateInputValue, type TemplateOutputType } from './Template'

export interface ITemplateCompilerSpi {
  compile: (text: string) => TemplateSpi
}

export class TemplateCompiler {
  constructor(private _spi: ITemplateCompilerSpi) {}

  compile = (text: string, type: TemplateOutputType = 'string'): Template => {
    return new Template(this._spi.compile(text), type)
  }

  compileObject = (object: { [key: string]: string }): { [key: string]: Template } => {
    return Object.entries(object).reduce((acc: { [key: string]: Template }, [key, value]) => {
      acc[key] = this.compile(value)
      return acc
    }, {})
  }

  compileObjectWithType = (object: {
    [key: string]: TemplateInputValue
  }): { [key: string]: Template } => {
    return Object.entries(object).reduce(
      (acc: { [key: string]: Template }, [key, { value, type }]) => {
        acc[key] = this.compile(value, type)
        return acc
      },
      {}
    )
  }
}
