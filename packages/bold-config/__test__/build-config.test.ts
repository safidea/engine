import { promises as fs } from 'fs'
import { config, folder } from './setup'
import buildConfig from '../src/build-config'
import getI18nScript from '../src/get-i18n-script'
import getFontsScript from '../src/get-fonts-script'
import getTailwindScript from '../src/get-tailwind-script'
import { getComponentScript } from 'bold-component'

const { apis, pages, components, tables, theme, locales, ...app } = config

beforeEach(async () => {
  await buildConfig(config, folder + '/config')
})

test('should have created app file', async () => {
  const appFile = JSON.parse(await fs.readFile(`${folder}/config/json/app.json`, 'utf8'))
  expect(appFile).toEqual(app)
})

test('should have created theme file', async () => {
  const themeFile = JSON.parse(await fs.readFile(`${folder}/config/json/theme.json`, 'utf8'))
  expect(themeFile).toEqual(theme)
})

test('should have created locales file', async () => {
  const localesFile = JSON.parse(await fs.readFile(`${folder}/config/json/locales.json`, 'utf8'))
  expect(localesFile).toEqual(locales)
})

test('should have created tables file', async () => {
  const tablesFile = JSON.parse(await fs.readFile(`${folder}/config/json/tables.json`, 'utf8'))
  expect(tablesFile).toEqual(tables)
})

test('should have created apis file', async () => {
  const apisFile = JSON.parse(await fs.readFile(`${folder}/config/json/apis.json`, 'utf8'))
  expect(apisFile).toEqual(apis)
})

test('should have created pages file', async () => {
  const pagesFile = JSON.parse(await fs.readFile(`${folder}/config/json/pages.json`, 'utf8'))
  expect(pagesFile).toEqual(pages)
})

test('should have created i18n file', async () => {
  const i18nFile = await fs.readFile(`${folder}/config/i18n.js`, 'utf8')
  expect(i18nFile).toEqual(getI18nScript(config))
})

test('should have created tailwind file', async () => {
  const tailwindFile = await fs.readFile(`${folder}/config/tailwind.js`, 'utf8')
  expect(tailwindFile).toEqual(getTailwindScript(theme ?? {}))
})

test('should have created fonts file', async () => {
  const fontsFile = await fs.readFile(`${folder}/config/fonts.ts`, 'utf8')
  expect(fontsFile).toEqual(getFontsScript(theme?.fonts ?? []))
})

test('should have created components files', async () => {
  for (const component of components ?? []) {
    const componentFile = await fs.readFile(
      `${folder}/config/components/${component.name}.jsx`,
      'utf8'
    )
    expect(componentFile).toEqual(getComponentScript(component))
  }
})
