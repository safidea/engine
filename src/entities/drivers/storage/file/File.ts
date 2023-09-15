import { FileParams } from './FileParams'

export class File {
  readonly filename: string
  readonly mimetype: string
  readonly extension: string
  readonly path?: string

  constructor(
    readonly buffer: Buffer,
    params: FileParams
  ) {
    const { filename, mimetype, path, extension } = params
    if (extension) this.extension = extension
    else {
      const extensionFromFilename = filename.split('.').pop()
      if (!extensionFromFilename) throw new Error('Filename must have an extension')
      this.extension = extensionFromFilename
    }
    if (mimetype) this.mimetype = mimetype
    else
      switch (this.extension) {
        case 'pdf':
          this.mimetype = 'application/pdf'
          break
        default:
          this.mimetype = 'application/octet-stream'
          break
      }
    this.filename = filename
    this.path = path
  }

  params(): FileParams {
    return {
      filename: this.filename,
      mimetype: this.mimetype,
      extension: this.extension,
      path: this.path,
    }
  }
}
