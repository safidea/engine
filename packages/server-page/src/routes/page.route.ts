import PageService from '../services/page.service'

import type { ComponentsInterface } from 'server-component'
import type { MetadataType } from '../types/metadata.type'

class PageRoute {
  public generateStaticPaths(): string[] {
    return PageService.getPaths()
  }

  public generateMetadata(path: string): MetadataType {
    return PageService.getMetadata(path)
  }

  public generateComponents(path: string): ComponentsInterface | undefined {
    return PageService.getComponents(path)
  }
}

export default new PageRoute()
