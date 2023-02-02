import { promises as fs } from 'fs'
import { fsExists } from 'utils'

import type { Locale } from '../types/config.type'

export default async function buildLocales(
  locales: Locale[] | undefined,
  folder = './public'
): Promise<void> {
  if (!locales || locales.length === 0) return
  const localesPath = `${folder}/locales`

  if (await fsExists(localesPath)) await fs.rm(localesPath, { recursive: true, force: true })
  await fs.mkdir(localesPath)

  await Promise.all(
    locales.map(({ locale, namespaces }) => {
      const localePath = `${localesPath}/${locale}`
      return fs
        .mkdir(localePath)
        .then(() =>
          Promise.all(
            Object.keys(namespaces).map((namespace) =>
              fs.writeFile(
                `${localePath}/${namespace}.json`,
                JSON.stringify(namespaces[namespace], null, 2)
              )
            )
          )
        )
    })
  )
}
