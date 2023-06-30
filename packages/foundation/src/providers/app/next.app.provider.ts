import fs from 'fs-extra'
import { join } from 'path'
import { StringUtils } from 'shared-common'

import type {
  AppProviderInterface,
  AppProviderPageInterface,
  AppProviderRouteInterface,
  AppProviderFoundationFileOptions,
} from 'shared-common'
import type { PagesInterface } from 'shared-page'
import type { ProviderProps } from '../../interfaces/provider'

class NextServerProvider implements AppProviderInterface {
  private appPath: string
  private componentsPath: string
  private pages: PagesInterface | undefined

  constructor({ configUtils, pathUtils }: ProviderProps) {
    this.appPath = pathUtils.getAppPath()
    this.componentsPath = join(this.appPath, 'components')
    this.pages = configUtils.get('pages')
  }

  public async writeFoundationFile({
    withOrm = false,
    withComponents = false,
  }: AppProviderFoundationFileOptions) {
    const serverPath = join(this.appPath, 'foundation.js')
    await fs.ensureFile(serverPath)
    await fs.writeFile(serverPath, this.getFoundationTemplate({ withOrm, withComponents }))
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

  private getFoundationTemplate({ withOrm, withComponents }: AppProviderFoundationFileOptions) {
    return `import Foundation from 'foundation'
    import Image from 'next/image'
    import Link from 'next/link'
    ${withOrm ? "import orm from './orm'" : ''}
    ${withComponents ? "import * as Components from './components'" : ''}

    export default new Foundation({
      components: { Image, Link ${withComponents ? ', ...Components' : ''} },
      ${withOrm ? 'orm,' : ''}
    })`
  }

  private getPathDots(path: string): string {
    const pathSegments = path.split('/').filter((segment) => segment !== '')
    return pathSegments.length > 0 ? pathSegments.map(() => '..').join('/') : '.'
  }

  private getRouteTemplate(route: AppProviderRouteInterface) {
    const pathDots = this.getPathDots(route.path)
    return `import Foundation from '${pathDots}/../foundation'
    import { NextResponse } from 'next/server'
    ${route.methods.includes('GET') ? "import url from 'url'" : ''}
    ${route.methods.includes('GET') ? "import querystring from 'querystring'" : ''}
    
    ${route.methods
      .map((method) => {
        method = method.toUpperCase()
        return `export async function ${method}(request, { params = {} }) {
            const { json, status = 200 } = await Foundation.api({
              method: '${method}',
              url: request.url,
              params,
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
    return `import Foundation from '${pathDots}/foundation'
                
    export const metadata = ${JSON.stringify({ title, ...metadata }, null, 2)}
    
    export default function Page(props) {
      return <Foundation.Page {...props} path="${page.path}" />
    }
    `
  }

  private getClientComponentTemplate(name: string) {
    const capitalizeName = StringUtils.capitalize(name)
    return `'use client'

    import { Components } from 'foundation'
    import { useRouter } from 'next/navigation'
    
    export default function ${StringUtils.capitalize(name)}(props) {
      const router = useRouter()
      return <Components.${capitalizeName} {...props} router={router} />
    }
    `
  }
}

export default NextServerProvider
