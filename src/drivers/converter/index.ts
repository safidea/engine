import {
  HtmlToPdfConverterDriver,
  IConverterDrivers,
} from '@adapters/services/converter/IConverterDrivers'
import { PuppeteerHtmlToPdfConverter } from './HtmlToPdfConverter/PuppeteerHtmlToPdfConverter'

export type ConverterDrivers = {
  htmlToPdf: 'puppeteer'
}

export function getConverterDrivers(
  driversNames: ConverterDrivers = { htmlToPdf: 'puppeteer' }
): IConverterDrivers {
  const { htmlToPdf = 'puppeteer' } = driversNames
  let htmlToPdfConverter: HtmlToPdfConverterDriver

  switch (htmlToPdf) {
    case 'puppeteer':
      htmlToPdfConverter = new PuppeteerHtmlToPdfConverter()
      break
    default:
      throw new Error(`HtmlToPdf Converter driver '${htmlToPdf}' not found`)
  }

  return {
    htmlToPdfConverter,
  }
}
