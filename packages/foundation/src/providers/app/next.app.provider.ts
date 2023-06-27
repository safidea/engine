import fs from 'fs-extra'
import { join } from 'path'
import { StringUtils } from 'shared-common'

import type {
  AppProviderInterface,
  AppProviderPageInterface,
  AppProviderRouteInterface,
} from 'shared-common'
import type { PagesInterface } from 'shared-page'

class NextServerProvider implements AppProviderInterface {
  private appPath: string
  private componentsPath: string
  private pages: PagesInterface | undefined

  constructor({ pages }: { pages?: PagesInterface }) {
    this.appPath = join(process.cwd(), 'app')
    this.componentsPath = join(process.cwd(), 'components')
    this.pages = pages
  }

  public async writeServerFile(withOrm = false) {
    const serverPath = join(this.appPath, 'server.js')
    await fs.ensureFile(serverPath)
    await fs.writeFile(serverPath, this.getServerTemplate(withOrm))
  }

  public async writeClientFile() {
    const clientPath = join(this.appPath, 'client.js')
    await fs.ensureFile(clientPath)
    await fs.writeFile(clientPath, this.getClientTemplate())
  }

  public async buildPages(pages: AppProviderPageInterface[]) {
    await Promise.all(pages.map((page) => this.writePageFile(page)))
  }

  public async buildRoutes(routes: AppProviderRouteInterface[]) {
    await Promise.all(routes.map((route) => this.writeRouteFile(route)))
  }

  public async buildClientComponents(names: string[]) {
    await this.writeClientComponentsIndexFile(names)
    await Promise.all(names.map((name) => this.writeClientComponentFile(name)))
  }

  private async writePageFile(page: AppProviderPageInterface) {
    const pagePath = join(this.appPath, page.path, 'page.js')
    await fs.ensureFile(pagePath)
    await fs.writeFile(pagePath, this.getPageTemplate(page))
  }

  private async writeRouteFile(route: AppProviderRouteInterface) {
    const pagePath = join(this.appPath, 'api', route.path, 'route.js')
    await fs.ensureFile(pagePath)
    await fs.writeFile(pagePath, this.getRouteTemplate(route))
  }

  private async writeClientComponentFile(name: string) {
    const componentPath = join(this.componentsPath, `${name}.jsx`)
    await fs.ensureFile(componentPath)
    await fs.writeFile(componentPath, this.getClientComponentTemplate(name))
  }

  private async writeClientComponentsIndexFile(names: string[]) {
    const indexFilePath = join(this.componentsPath, 'index.js')
    await fs.ensureFile(indexFilePath)
    await fs.writeFile(
      indexFilePath,
      names.map((name) => `export { default as ${name} } from './${name}'`).join('\n')
    )
  }

  private getServerTemplate(withOrm: boolean) {
    return `import AppServer from 'foundation/server'
    ${withOrm ? "import orm from './orm'" : ''}

    export default new AppServer(${withOrm ? '{ orm }' : ''})`
  }

  private getClientTemplate() {
    return `import AppClient from 'foundation/client'
    import Image from 'next/image'
    import Link from 'next/link'
    import * as Components from '../components'

    export default function NextAppClient({ page }) {
      return <AppClient appProviderComponents={{ Image, Link, ...Components }} page={page} />
    }`
  }

  private getPathDots(path: string): string {
    const pathSegments = path.split('/').filter((segment) => segment !== '')
    return pathSegments.length > 0 ? pathSegments.map(() => '..').join('/') : '.'
  }

  private getRouteTemplate(route: AppProviderRouteInterface) {
    const pathDots = this.getPathDots(route.path)
    return `import NextAppServer from '${pathDots}/../server'
    import { NextResponse } from 'next/server'
    ${route.methods.includes('GET') ? "import url from 'url'" : ''}
    ${route.methods.includes('GET') ? "import querystring from 'querystring'" : ''}
    
    ${route.methods
      .map((method) => {
        method = method.toUpperCase()
        return `export async function ${method}(request, { params = {} }) {
            const { json, status = 200 } = await NextAppServer.apiHandler({
              method: '${method}',
              url: request.url,
              params,
              local: {},
              ${['POST', 'PUT', 'PATCH'].includes(method) ? 'body: await request.json(),' : ''}
              ${method === 'GET' ? 'query: querystring.parse(url.parse(request.url).query)' : ''}
            })
            return NextResponse.json(json, { status })
          }`
      })
      .join('\n\n')}`
  }

  private getPageTemplate(page: AppProviderPageInterface) {
    const pathDots = this.getPathDots(page.path)
    const { title, metadata = {} } = this.pages?.[page.path] ?? {}
    return `import NextAppClient from '${pathDots}/client'
    import NextAppServer from '${pathDots}/server'
                
    export const metadata = ${JSON.stringify({ title, ...metadata }, null, 2)}
    
    export default function Page() {
      const page = NextAppServer.getConfigFromPath('pages.${page.path}')
      return <NextAppClient page={page} />
    }
    `
  }

  private getClientComponentTemplate(name: string) {
    const capitalizeName = StringUtils.capitalize(name)
    return `'use client'

    import Components from 'foundation/components'
    import { useRouter } from 'next/navigation'

    const ${capitalizeName} = (props) => Components.${name}({ ...props, router: useRouter() })
    
    export default ${capitalizeName}
    `
  }
}

export default NextServerProvider
