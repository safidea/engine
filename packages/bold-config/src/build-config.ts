import { promises as fs } from 'fs'
import { fsExists } from 'utils'

import getI18nScript from './get-i18n-script'
import getFontsScript from './get-fonts-script'
import getTailwindScript from './get-tailwind-script'
import { getComponentScript, getComponentsIndexScript } from 'bold-component'

import type { Config, ComponentUI } from '../types/config.type'

export default async function buildConfig(config: Config, folder: string): Promise<void> {
  const { pages, components, apis, tables, theme, locales, ...app } = config

  await fsExists(`${folder}`).then(async (e) => e || (await fs.mkdir(`${folder}`)))
  await Promise.all([
    fsExists(`${folder}/json`).then(async (e) => e || (await fs.mkdir(`${folder}/json`))),
    fsExists(`${folder}/components`).then(
      async (e) => e || (await fs.mkdir(`${folder}/components`))
    ),
  ])

  await Promise.all([
    fs.writeFile(`${folder}/json/app.json`, JSON.stringify(app, null, 2)),
    fs.writeFile(`${folder}/json/theme.json`, JSON.stringify(theme, null, 2)),
    fs.writeFile(`${folder}/json/apis.json`, JSON.stringify(apis, null, 2)),
    fs.writeFile(`${folder}/json/pages.json`, JSON.stringify(pages, null, 2)),
    fs.writeFile(`${folder}/json/tables.json`, JSON.stringify(tables, null, 2)),
    fs.writeFile(`${folder}/json/locales.json`, JSON.stringify(locales, null, 2)),
    fs.writeFile(`${folder}/fonts.ts`, getFontsScript(theme?.fonts ?? [])),
    fs.writeFile(`${folder}/tailwind.js`, getTailwindScript(theme ?? {})),
    fs.writeFile(`${folder}/i18n.js`, getI18nScript(config)),
    ...(components ?? []).map((component: ComponentUI) =>
      fs.writeFile(`${folder}/components/${component.name}.tsx`, getComponentScript(component))
    ),
    fs.writeFile(`${folder}/components/index.ts`, getComponentsIndexScript(components ?? [])),
  ])
}
