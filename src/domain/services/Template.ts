export interface Spi {
  fill: (data: Record<string, unknown>) => string
}

export class Template {
  constructor(private spi: Spi) {}

  fill = (data: Record<string, unknown>): string => {
    return this.spi.fill(data)
  }
}
