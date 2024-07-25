import fs from 'fs-extra'
import { join } from 'path'
import puppeteer, { Page } from 'puppeteer'
import xml2js from 'xml2js'

const extractCodesExamplesInFile = async (url: string, page: Page) => {
  const codes = []
  console.log('Going to URL ', url)
  await page.goto(url)
  console.log('Getting codes')
  const names = await page.$$('h2')
  for (let i = 0; i < names.length; i++) {
    const nameEl = names[i]
    const name = await nameEl.evaluate((element) => element.getAttribute('id'))
    const code = await page
      .$(`h2#${name} + p + div code, h2#${name} + div + p + div code`)
      .then((el) => el?.evaluate((element) => element.textContent))
    if (code) {
      codes.push({ code, name })
      console.log(`Extracted example: ${name}`)
    }
  }
  console.log(`Extracted ${codes.length} examples`)
  const name = url.split('/').pop()?.split('.')[0]
  const dir = join(__dirname, 'components')
  const path = join(dir, `${name}.json`)
  console.log(`Writing ${name}.json file`)
  await fs.ensureDir(dir)
  await fs.writeJSON(path, codes, { spaces: 2 })
}

async function extractSitemapComponentsUrls(url: string, page: Page): Promise<string[]> {
  console.log('Going to URL ', url)
  await page.goto(url, { waitUntil: 'networkidle2' })
  let sitemapContent = await page.evaluate(() => document.body.innerText)
  console.log('Extracting URLs')
  sitemapContent = sitemapContent.trim()
  const xmlStartIndex = sitemapContent.indexOf('<urlset')
  if (xmlStartIndex === -1) {
    throw new Error('Invalid XML content.')
  }
  sitemapContent = sitemapContent.slice(xmlStartIndex)
  sitemapContent = sitemapContent.replace(/<!--[\s\S]*?-->/g, '')
  const parser = new xml2js.Parser()
  const urls = await new Promise<string[]>((resolve, reject) => {
    parser.parseString(
      sitemapContent,
      (err: null | Error, result: { urlset: { url: { loc: string[] }[] } }) => {
        if (err) {
          console.error('Error parsing XML:', err)
          reject(err)
        }
        const forbiddenWords = [
          'changelog',
          'index',
          'frameworks',
          'javascript',
          'license',
          'configuration',
          'dark-mode',
          'theme',
        ]
        const urls = result.urlset.url
          .map((entry) => entry.loc[0])
          .filter(
            (url) =>
              url.startsWith('https://preline.co/docs/') &&
              !forbiddenWords.some((word) => url.includes(word))
          )
        resolve(urls)
      }
    )
  })
  return urls
}

async function main() {
  console.log('Lauching browser')
  const browser = await puppeteer.launch()
  try {
    console.log('Opening page')
    const page = await browser.newPage()
    const urls = await extractSitemapComponentsUrls('https://preline.co/sitemap.xml', page)
    console.log(`Extracted ${urls.length} URLs`)
    let i = 0
    for (const url of urls) {
      console.log(`Processing URL ${++i}/${urls.length}`)
      await extractCodesExamplesInFile(url, page)
    }
    console.log('Done')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    console.log('Closing browser')
    await browser.close()
  }
}

main()
