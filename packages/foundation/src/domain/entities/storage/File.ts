export class File {
  constructor(
    private readonly _filename: string,
    private readonly _data: string
  ) {}

  get filename(): string {
    return this._filename
  }

  get data(): string {
    return this._data
  }
}
