import { join } from 'path'
import fs from 'fs-extra'
import { PuppeteerHtmlToPdfConverter } from './HtmlToPdfConverter/PuppeteerHtmlToPdfConverter'

export interface ConverterOptions {
  htmlToPdfConverter?: any
}

export class Converter {
  private htmlToPdfConverter: any

  constructor(folder: string, converterOptions: ConverterOptions = {}) {
    const tmpFolder = join(folder, 'tmp')
    fs.ensureDirSync(tmpFolder)
    const { htmlToPdfConverter } = converterOptions
    this.htmlToPdfConverter = htmlToPdfConverter ?? new PuppeteerHtmlToPdfConverter(tmpFolder)
  }

  async htmlToPdf(html: string, filename: string) {
    return this.htmlToPdfConverter.convert(html, filename)
  }
}
