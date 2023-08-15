export class File {
  constructor(
    private readonly _filename: string,
    private readonly _data: Buffer
  ) {}

  get filename(): string {
    return this._filename
  }

  get data(): Buffer {
    return this._data
  }
}
