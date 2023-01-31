import { promises as fs } from 'fs'
import yaml from 'js-yaml'

import { fsExists } from 'bold-utils'
import { checkSchema } from 'bold-config'

import type { App, Config, Page, Api, Table, Theme } from 'bold-config'
import type { LocaleTree } from 'bold-locale'
import type { ComponentTree } from 'bold-component'

const folderPath = './config-folder'
const themePath = `${folderPath}/theme.yaml`
const pagesPath = `${folderPath}/pages`
const componentsPath = `${folderPath}/components`
const apisPath = `${folderPath}/apis`
const tablesPath = `${folderPath}/tables`
const localesPath = `${folderPath}/locales`

;(async () => {
  console.info('Start building Bold config file...')

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
                    ui: yaml.load(data) as Omit<ComponentTree, 'name'>,
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
                      async (acc: Promise<LocaleTree>, namespace: string) => {
                        const nextAcc = await acc
                        const name = namespace.replace('.yaml', '')
                        nextAcc[name as keyof typeof nextAcc] = await fs
                          .readFile(`${localesPath}/${locale}/${namespace}`, 'utf8')
                          .then((data: string) => yaml.load(data) as LocaleTree)
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

  checkSchema(config)

  await fs.writeFile('./simple.bold.yaml', yaml.dump(config))

  console.info('Bold config file building success!')
})()
