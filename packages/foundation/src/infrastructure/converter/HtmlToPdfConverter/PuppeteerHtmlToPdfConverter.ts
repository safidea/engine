import { join } from 'path'
import fs from 'fs-extra'
import puppeteer from 'puppeteer'

export class PuppeteerHtmlToPdfConverter {
  constructor(private tmpFolder: string) {}

  async convert(html: string, filename: string) {
    const filePath = join(this.tmpFolder, filename)
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
