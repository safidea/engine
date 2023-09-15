import { join } from 'path'
import fs from 'fs-extra'
import puppeteer from 'puppeteer'
import { v4 as uuidv4 } from 'uuid'
import { HtmlToPdfConverterDriver } from '@adapters/services/converter/IConverterDrivers'

export class PuppeteerHtmlToPdfConverter implements HtmlToPdfConverterDriver {
  async convert(html: string, tmpFolder: string) {
    const filePath = join(tmpFolder, uuidv4())
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.setContent(html)
    await page.pdf({ path: filePath, format: 'A4' })
    await browser.close()
    const file = await fs.readFile(filePath)
    await fs.remove(filePath)
    return file
  }
}
