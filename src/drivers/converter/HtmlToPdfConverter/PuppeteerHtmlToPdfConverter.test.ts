import { describe } from '@jest/globals'
import { helpers } from '@specs/utils/unit/fixtures'
import { PuppeteerHtmlToPdfConverter } from './PuppeteerHtmlToPdfConverter'

describe('PuppeteerHtmlToPdfConverter', () => {
  test('should render a buffer', async () => {
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
