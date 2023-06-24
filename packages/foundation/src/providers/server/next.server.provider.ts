import { ConfigUtils } from 'server-common'
import fs from 'fs-extra'
import { join } from 'path'

import type { ServerProviderInterface } from 'shared-common'
import type { PagesInterface } from 'server-page'

class NextServerProvider implements ServerProviderInterface {
  private configUtils: ConfigUtils
  private appPath: string
  private pages: PagesInterface

  constructor({ configUtils }: { configUtils: ConfigUtils }) {
    this.configUtils = configUtils
    this.appPath = join(process.cwd(), 'app')
    this.pages = this.configUtils.get('pages') as PagesInterface
  }

  public async buildPages() {
    await Promise.all([
      this.writeServerFile(),
      this.writeClientFile(),
      ...Object.keys(this.pages).map((path) => this.writePageFile(path)),
    ])
  }

  private async writePageFile(path: string) {
    const pagePath = join(this.appPath, path, 'page.js')
    await fs.ensureFile(pagePath)
    await fs.writeFile(pagePath, this.getPageTemplate(path))
  }

  private async writeServerFile() {
    const serverPath = join(this.appPath, 'server.js')
    await fs.ensureFile(serverPath)
    await fs.writeFile(serverPath, this.getServerTemplate())
  }

  private async writeClientFile() {
    const clientPath = join(this.appPath, 'client.js')
    await fs.ensureFile(clientPath)
    await fs.writeFile(clientPath, this.getClientTemplate())
  }

  private getServerTemplate() {
    return `import AppServer from 'foundation/server'

    export default new AppServer()`
  }

  private getClientTemplate() {
    return `import AppClient from 'foundation/client'
    import Image from 'next/image'
    import Link from 'next/link'

    export default function NextAppClient({ page }) {
      return <AppClient serverProviderComponents={{ Image, Link }} page={page} />
    }`
  }

  private getPageTemplate(path: string) {
    // we need to know the number of path segments
    // so we can determine the number of dots to use
    // in the import statement
    const pathSegments = path.split('/').filter((segment) => segment !== '')
    const pathDots = pathSegments.length > 0 ? pathSegments.map(() => '..').join('/') : '.'
    return `import NextAppClient from '${pathDots}/client'
    import NextAppServer from '${pathDots}/server'
                
    export async function generateMetadata() {
      const page = NextAppServer.getConfigFromPath('pages.${path}')
      const { title, metadata = {} } = page
      return { title, ...metadata }
    }
    
    export default function Page() {
      const page = NextAppServer.getConfigFromPath('pages.${path}')
      return <NextAppClient page={page} />
    }
    `
  }
}

export default NextServerProvider
