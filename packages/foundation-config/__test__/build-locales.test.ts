import { fsExists } from 'utils'
import { config, folder } from './setup'
import buildLocales from '../src/build-locales'

test('build locales directory', async () => {
  const { locales } = config
  await buildLocales(locales, folder)
  for (const { locale, namespaces } of locales ?? []) {
    for (const namespace of Object.keys(namespaces)) {
      expect(await fsExists(`${folder}/locales/${locale}/${namespace}.json`)).toBe(true)
    }
  }
})
