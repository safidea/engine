import { describe, test, expect } from 'bun:test'
import { helpers } from '@test/unit/fixtures'
import { PuppeteerHtmlToPdfConverter } from './PuppeteerHtmlToPdfConverter'

describe('PuppeteerHtmlToPdfConverter', () => {
  // TODO: wait for bun to support puppeteer
  test.skip('should render a buffer', async () => {
    // GIVEN
    const html = '<h1>Hello world</h1>'
    const tmpFolder = helpers.getDedicatedTmpFolder()
    const converter = new PuppeteerHtmlToPdfConverter(tmpFolder)

    // WHEN
    const file = await converter.convert(html)

    // THEN
    expect(file).toBeDefined()
  })
})
