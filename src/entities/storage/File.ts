export class File {
  private _mimetype: string

  constructor(
    private readonly _filename: string,
    private readonly _data: Buffer,
    private readonly _path?: string
  ) {
    const extension = this._filename.split('.').pop()
    if (!extension) throw new Error('Filename must have an extension')
    switch (extension) {
      case 'pdf':
        this._mimetype = 'application/pdf'
        break
      default:
        this._mimetype = 'application/octet-stream'
        break
    }
  }

  get filename(): string {
    return this._filename
  }

  get mimetype(): string {
    return this._mimetype
  }

  get path(): string | undefined {
    return this._path
  }

  get data(): Buffer {
    return this._data
  }
}
