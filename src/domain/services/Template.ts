export type OutputType = 'string' | 'number' | 'boolean' | 'object' | 'array'
export type OutputValue = string | number | boolean | object | Array<unknown>
export interface InputValue {
  value: string
  type?: OutputType
}
export interface InputValues {
  [key: string]: InputValue
}

export interface Spi {
  fill: (data: Record<string, unknown>) => string
}

export class Template {
  constructor(
    private _spi: Spi,
    private _outputType: OutputType = 'string'
  ) {}

  fill = (data: Record<string, unknown>): OutputValue => {
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

  fillAsString = (data: Record<string, unknown>): string => {
    return this._spi.fill(data)
  }
}
