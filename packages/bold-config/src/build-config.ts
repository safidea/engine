import { promises as fs } from 'fs'
import { fsExists } from 'utils'

import getI18nScript from './get-i18n-script'
import getFontsScript from './get-fonts-script'
import getTailwindScript from './get-tailwind-script'
import { getComponentScript, getComponentsIndexScript } from 'bold-component'

import type { Config, ComponentUI } from '../types/config.type'

export default async function buildConfig(config: Config, folder: string): Promise<void> {
  const { pages, components, apis, tables, theme, locales, ...app } = config

  const path = folder + '/config'

  await fsExists(`${path}`).then(async (e) => e || (await fs.mkdir(`${path}`)))
  await Promise.all([
    fsExists(`${path}/json`).then(async (e) => e || (await fs.mkdir(`${path}/json`))),
    fsExists(`${path}/components`).then(async (e) => e || (await fs.mkdir(`${path}/components`))),
  ])

  await Promise.all([
    fs.writeFile(`${path}/json/app.json`, JSON.stringify(app, null, 2)),
    fs.writeFile(`${path}/json/theme.json`, JSON.stringify(theme, null, 2)),
    fs.writeFile(`${path}/json/apis.json`, JSON.stringify(apis, null, 2)),
    fs.writeFile(`${path}/json/pages.json`, JSON.stringify(pages, null, 2)),
    fs.writeFile(`${path}/json/tables.json`, JSON.stringify(tables, null, 2)),
    fs.writeFile(`${path}/json/locales.json`, JSON.stringify(locales, null, 2)),
    fs.writeFile(`${path}/fonts.ts`, getFontsScript(theme?.fonts ?? [])),
    fs.writeFile(`${path}/tailwind.js`, getTailwindScript(theme ?? {})),
    fs.writeFile(`${path}/i18n.js`, getI18nScript(config)),
    ...(components ?? []).map((component: ComponentUI) =>
      fs.writeFile(`${path}/components/${component.name}.tsx`, getComponentScript(component))
    ),
    fs.writeFile(`${path}/components/index.ts`, getComponentsIndexScript(components ?? [])),
  ])
}
