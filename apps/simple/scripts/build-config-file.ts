import { promises as fs } from 'fs'
import yaml from 'js-yaml'
import * as dotenv from 'dotenv'
dotenv.config()

import { fsExists } from 'utils'
import { checkSchema } from 'bold-config'
import { testComponentsUI } from 'bold-component'

import type { App, Config, Page, Api, Table, Theme, Resources } from 'bold-config'
import type { ComponentUI } from 'bold-component'

const folderPath = './config'
const themePath = `${folderPath}/theme.yaml`
const pagesPath = `${folderPath}/pages`
const componentsPath = `${folderPath}/components`
const apisPath = `${folderPath}/apis`
const tablesPath = `${folderPath}/tables`
const localesPath = `${folderPath}/locales`

const configFile = process.env.BOLD_CONFIG_FILE ?? './config.yaml'
const boldAppFolder = process.env.BOLD_APP_FOLDER ?? '../bold'

;(async () => {
  console.info('Start building Request config file...')

  const [app, theme, pages, components, apis, tables, locales] = await Promise.all([
    fs.readFile(`${folderPath}/app.yaml`, 'utf8').then((data) => yaml.load(data) as App),
    fsExists(themePath).then(async (e: boolean) =>
      e ? await fs.readFile(themePath, 'utf8').then((data) => yaml.load(data) as Theme) : {}
    ),
    fsExists(pagesPath).then(async (e: boolean) =>
      e
        ? await fs.readdir(pagesPath).then((paths: string[]) =>
            Promise.all(
              paths.map((path: string) =>
                fs.readFile(`${pagesPath}/${path}`, 'utf8').then((data: string) => ({
                  path: path.replace('.yaml', ''),
                  ...(yaml.load(data) as Omit<Page, 'path'>),
                }))
              )
            )
          )
        : []
    ),
    fsExists(componentsPath).then(async (e: boolean) =>
      e
        ? await fs.readdir(componentsPath).then((components: string[]) =>
            Promise.all(
              components
                .filter((name) => name.match(/.yaml$/))
                .map((name: string) =>
                  fs.readFile(`${componentsPath}/${name}`, 'utf8').then((data: string) => ({
                    name: name.replace('.yaml', ''),
                    ...(yaml.load(data) as Omit<ComponentUI, 'name'>),
                  }))
                )
            )
          )
        : []
    ),
    fsExists(apisPath).then(async (e: boolean) =>
      e
        ? await fs.readdir(apisPath).then((apis: string[]) =>
            Promise.all(
              apis.map((name: string) =>
                fs.readFile(`${apisPath}/${name}`, 'utf8').then((data: string) => ({
                  name: name.replace('.yaml', ''),
                  ...(yaml.load(data) as Omit<Api, 'name'>),
                }))
              )
            )
          )
        : []
    ),
    fsExists(tablesPath).then(async (e: boolean) =>
      e
        ? await fs.readdir(tablesPath, 'utf8').then(async (tables: string[]) =>
            Promise.all(
              tables.map((table: string) =>
                fs.readFile(`${tablesPath}/${table}`, 'utf8').then((data: string) => ({
                  name: table.replace('.yaml', ''),
                  ...(yaml.load(data) as Omit<Table, 'name'>),
                }))
              )
            )
          )
        : []
    ),
    fsExists(localesPath).then(async (e: boolean) =>
      e
        ? await fs.readdir(localesPath).then((locales: string[]) =>
            Promise.all(
              locales.map((locale: string) =>
                fs
                  .readdir(`${localesPath}/${locale}`, 'utf8')
                  .then(async (namespaces: string[]) => ({
                    locale,
                    namespaces: await namespaces.reduce(
                      async (acc: Promise<Resources>, namespace: string) => {
                        const nextAcc = await acc
                        const name = namespace.replace('.yaml', '')
                        nextAcc[name as keyof typeof nextAcc] = await fs
                          .readFile(`${localesPath}/${locale}/${namespace}`, 'utf8')
                          .then((data: string) => yaml.load(data) as Resources)
                        return nextAcc
                      },
                      Promise.resolve({})
                    ),
                  }))
              )
            )
          )
        : []
    ),
  ])

  const config: Config = {
    ...app,
    theme,
    pages,
    components,
    apis,
    locales,
    tables,
  }

  await checkSchema(config)
  if (config.components) await testComponentsUI(config.components)
  await fs.writeFile(configFile, yaml.dump(config))

  let env = await fs.readFile('./.env', 'utf8')
  env = env.replace(
    'BOLD_CONFIG_FILE=./simple.bold.yaml',
    'BOLD_CONFIG_FILE=../simple/simple.bold.yaml'
  )
  await fs.writeFile(boldAppFolder + '/.env.local', env)

  console.info('Request config file build succeed!')
})()
