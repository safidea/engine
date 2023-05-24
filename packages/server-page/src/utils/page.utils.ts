import type { NextParamsType } from '../types/next.type'

class PageUtils {
  getPathFromParams(params: NextParamsType) {
    return `/${params.path?.join('/') ?? ''}`
  }
}

export default new PageUtils()
