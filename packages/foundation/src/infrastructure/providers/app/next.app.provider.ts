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
import type { ProviderProps } from '../../../domain/interfaces/provider'

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

  public async buildComponents({ clients, servers }: { clients: string[]; servers: string[] }) {
    await this.writeComponentsIndexFile([clients, servers].flat())
    await Promise.all([
      ...clients.map((name) => this.writeClientComponentFile(name)),
      ...servers.map((name) => this.writeServerComponentFile(name)),
    ])
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

  private async writeServerComponentFile(name: string) {
    const componentPath = join(this.componentsPath, `${name}.jsx`)
    await fs.ensureFile(componentPath)
    await fs.writeFile(componentPath, this.getServerComponentTemplate(name))
  }

  private async writeComponentsIndexFile(names: string[]) {
    const indexFilePath = join(this.componentsPath, 'index.js')
    await fs.ensureFile(indexFilePath)
    await fs.writeFile(
      indexFilePath,
      names.map((name) => `export { default as ${name} } from './${name}'`).join('\n')
    )
  }

  private getFoundationTemplate({ withOrm, withComponents }: AppProviderFoundationFileOptions) {
    return `// @ts-check
    import Foundation from 'foundation'
    ${withOrm ? "import orm from './orm'" : ''}
    ${withComponents ? `import * as Components from './components'` : ''}

    export default new Foundation({
      ${withComponents ? `components: Components,` : ''}
      ${withOrm ? 'orm,' : ''}
    })`
  }

  private getPathDots(path: string): string {
    const pathSegments = path.split('/').filter((segment) => segment !== '')
    return pathSegments.length > 0 ? pathSegments.map(() => '..').join('/') : '.'
  }

  private getRouteTemplate(route: AppProviderRouteInterface) {
    const pathDots = this.getPathDots(route.path)
    return `// @ts-check
    import Foundation from '${pathDots}/../foundation'
    import { NextResponse } from 'next/server'
    
    ${route.methods
      .map((method) => {
        method = method.toUpperCase()
        return `export async function ${method}(request, { params = {} }) {
          ${
            method === 'GET'
              ? `const queryParams = Array.from(new URL(request.url).searchParams.entries())
          const query = queryParams.length > 0 ? queryParams.reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {}) : null`
              : ''
          }
          const { json, status = 200 } = await Foundation.api({
            method: '${method}',
            url: request.url,
            params,
            local: {},
            ${method === 'GET' ? 'query,' : ''}
            ${['POST', 'PUT', 'PATCH'].includes(method) ? 'body: await request.json(),' : ''}
          })
          return NextResponse.json(json, { status })
        }`
      })
      .join('\n\n')}`
  }

  private getPageTemplate(page: AppProviderPageInterface) {
    const pathDots = this.getPathDots(page.path)
    const { title, metadata = {} } = this.pages?.[page.path] ?? {}
    const isDynamic = page.path.includes('[')
    return `// @ts-check
    import Foundation from '${pathDots}/foundation'
                
    export const metadata = ${JSON.stringify({ title, ...metadata }, null, 2)}
    
    export default function Page(${isDynamic ? '{ params }' : ''}) {
      return Foundation.page({ path: '${page.path}'${isDynamic ? ', pathParams: params' : ''} }) 
    }
    `
  }

  private getClientComponentTemplate(name: string) {
    const capitalizeName = StringUtils.capitalize(name)
    return `// @ts-check
    'use client'

    import ${capitalizeName} from 'client-component/dist/components/${capitalizeName}'
    import { useRouter, usePathname } from 'next/navigation'
    import Image from 'next/image'
    import Link from 'next/link'
    
    export default function Next${capitalizeName}(props) {
      const router = useRouter()
      const pathname = usePathname()
      return <${capitalizeName} {...props} router={router} pathname={pathname} components={{ Image, Link }} />
    }
    `
  }

  private getServerComponentTemplate(name: string) {
    const capitalizeName = StringUtils.capitalize(name)
    return `// @ts-check
    import ${capitalizeName} from 'client-component/dist/components/${capitalizeName}'
    import Image from 'next/image'
    import Link from 'next/link'
    
    export default function Next${capitalizeName}(props) {
      return <${capitalizeName} {...props} components={{ Image, Link }} />
    }
    `
  }
}

export default NextServerProvider
