import { join } from 'path'
import fs from 'fs-extra'
import { IConverterDrivers } from './IConverterDrivers'
import { IConverterService } from '@entities/services/converter/IConverterService'

export class ConverterService implements IConverterService {
  private readonly tmpFolder: string

  constructor(
    readonly drivers: IConverterDrivers,
    folder: string
  ) {
    this.tmpFolder = join(folder, 'tmp')
    fs.ensureDirSync(this.tmpFolder)
  }

  async htmlToPdf(html: string) {
    return this.drivers.htmlToPdfConverter.convert(html, this.tmpFolder)
  }
}
