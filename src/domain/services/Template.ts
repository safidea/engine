export type OutputParser = 'string' | 'number' | 'boolean' | 'object' | 'array'
export type OutputFormat = string | number | boolean | object | Array<unknown>

export interface Spi {
  fill: (data: Record<string, unknown>) => string
}

export class Template {
  constructor(
    private _spi: Spi,
    private _outputParser: OutputParser = 'string'
  ) {}

  fill = (data: Record<string, unknown>): OutputFormat => {
    const result = this._spi.fill(data)
    switch (this._outputParser) {
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
