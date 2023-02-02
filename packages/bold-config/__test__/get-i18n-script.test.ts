import { promises as fs } from 'fs'
import { config, folder } from './setup'
import getI18nScript from '../src/get-i18n-script'

test('get i18n script', async () => {
  const script = getI18nScript(config)

  await fs.writeFile(folder + '/i18n.js', script)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { i18n } = await import('./__running__/i18n.js')

  expect(i18n).toEqual({
    defaultLocale: config.defaultLocale,
    locales: config.locales?.map((t) => t.locale) ?? [],
    localeDetection: config.localeRedirect,
  })
})
