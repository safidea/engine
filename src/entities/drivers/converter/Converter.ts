import { join } from 'path'
import fs from 'fs-extra'
import { ConverterDrivers } from './ConverterDriver'

export class Converter {
  private readonly tmpFolder: string

  constructor(
    folder: string,
    readonly drivers: ConverterDrivers
  ) {
    this.tmpFolder = join(folder, 'tmp')
    fs.ensureDirSync(this.tmpFolder)
  }

  async htmlToPdf(html: string) {
    return this.drivers.htmlToPdfConverter.convert(html, this.tmpFolder)
  }
}
