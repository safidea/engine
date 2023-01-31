import { promises as fs } from 'fs'
import yaml from 'js-yaml'
import { defaultConfigFile } from '../build.constants'
import { fsExists } from '../build.utils'

import type { AppInterface } from '../build.interfaces'
import type { LocaleTreeInterface } from '../../locale/locale.interfaces'
import type { TableInterface } from '../../database/database.interfaces'
import type { ComponentInterface } from '../../component/component.interfaces'
import type { ApiInterface } from '../../api/api.interfaces'
import type { PageInterface } from '../../page/page.interfaces'
import type { ThemeInterface } from '../../theme/theme.interfaces'

export default async function buildConfigFile(
  folderName: string,
  folderRoot = './'
): Promise<string> {
  const configFilePath = folderRoot + defaultConfigFile.replace('./', '/')
  const folderPath = folderRoot + folderName
  const themePath = `${folderPath}/theme.yaml`
  const pagesPath = `${folderPath}/pages`
  const componentsPath = `${folderPath}/components`
  const apisPath = `${folderPath}/apis`
  const databasesPath = `${folderPath}/databases`
  const localesPath = `${folderPath}/locales`

  const [app, theme, pages, components, apis, databases, locales] = await Promise.all([
    fs.readFile(`${folderPath}/app.yaml`, 'utf8').then((data) => yaml.load(data) as AppInterface),
    fsExists(themePath).then(async (e: boolean) =>
      e
        ? await fs.readFile(themePath, 'utf8').then((data) => yaml.load(data) as ThemeInterface)
        : {}
    ),
    fsExists(pagesPath).then(async (e: boolean) =>
      e
        ? await fs.readdir(pagesPath).then((paths: string[]) =>
            Promise.all(
              paths.map((path: string) =>
                fs.readFile(`${pagesPath}/${path}`, 'utf8').then((data: string) => ({
                  path: path.replace('.yaml', ''),
                  ...(yaml.load(data) as Omit<PageInterface, 'path'>),
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
                    ui: yaml.load(data) as Omit<ComponentInterface, 'name'>,
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
                  ...(yaml.load(data) as Omit<ApiInterface, 'name'>),
                }))
              )
            )
          )
        : []
    ),
    fsExists(databasesPath).then(async (e: boolean) =>
      e
        ? await fs.readdir(databasesPath).then((base: string[]) =>
            Promise.all(
              base.map((base: string) =>
                fs.readdir(`${databasesPath}/${base}`, 'utf8').then(async (tables: string[]) => ({
                  name: base,
                  tables: await Promise.all(
                    tables.map((table: string) =>
                      fs
                        .readFile(`${databasesPath}/${base}/${table}`, 'utf8')
                        .then((data: string) => ({
                          name: table.replace('.yaml', ''),
                          ...(yaml.load(data) as Omit<TableInterface, 'name'>),
                        }))
                    )
                  ),
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
                    resources: await namespaces.reduce(
                      async (acc: Promise<LocaleTreeInterface>, namespace: string) => {
                        const nextAcc = await acc
                        const name = namespace.replace('.yaml', '')
                        nextAcc[name as keyof typeof nextAcc] = await fs
                          .readFile(`${localesPath}/${locale}/${namespace}`, 'utf8')
                          .then((data: string) => yaml.load(data) as LocaleTreeInterface)
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

  await fs.writeFile(
    configFilePath,
    yaml.dump({
      ...app,
      theme,
      pages,
      components,
      apis,
      locales,
      databases,
    })
  )

  return configFilePath
}
