import PageService from '../services/page.service'
import PageUtils from '../utils/page.utils'

import type { NextParamsType, NextMetadataType } from '../types/next.type'
import type { ComponentsInterface } from 'server-component'

class PageRoute {
  public generateStaticPaths(): { path: string[] }[] {
    const paths = PageService.getPaths()
    return paths
      .map((path) => path.substring(1))
      .filter((path) => path !== '')
      .map((path) => ({ path: path.split('/') }))
  }

  public generateMetadata(params: NextParamsType): NextMetadataType {
    const path = PageUtils.getPathFromParams(params)
    const metadata = PageService.getMetadata(path)
    if (!metadata) return {}
    return {
      title: metadata.title,
      description: metadata.description,
    }
  }

  public generateComponents(params: NextParamsType): ComponentsInterface | undefined {
    const path = PageUtils.getPathFromParams(params)
    return PageService.getComponents(path)
  }
}

export default new PageRoute()
