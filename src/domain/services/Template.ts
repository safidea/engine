export type TemplateOutputType = 'string' | 'number' | 'boolean' | 'object' | 'array'
export type TemplateOutputValue = string | number | boolean | object | Array<unknown>
export interface TemplateInputValue {
  value: string
  type?: TemplateOutputType
}
export interface TemplateInputValues {
  [key: string]: TemplateInputValue
}

export interface ITemplateSpi {
  fill: (data: { [key: string]: unknown }) => string
}

export class Template {
  constructor(
    private _spi: ITemplateSpi,
    private _outputType: TemplateOutputType = 'string'
  ) {}

  fill = (data: { [key: string]: unknown }): TemplateOutputValue => {
    const result = this._spi.fill(data)
    switch (this._outputType) {
      case 'string':
        return result
      case 'number':
        return parseFloat(result)
      case 'boolean':
        return result === 'true'
      case 'object':
      case 'array':
        return JSON.parse(result)
    }
  }

  fillAsString = (data: { [key: string]: unknown }): string => {
    return this._spi.fill(data)
  }
}
