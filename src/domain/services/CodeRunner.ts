export interface Spi {
  run: (data: object) => Promise<object>
}

export class CodeRunner {
  constructor(private _spi: Spi) {}

  run = (data: object): Promise<object> => {
    return this._spi.run(data)
  }
}
