export interface Spi {
  fill: (data: Record<string, unknown>) => string
}

export class Template {
  constructor(private _spi: Spi) {}

  fill = (data: Record<string, unknown>): string => {
    return this._spi.fill(data)
  }
}
