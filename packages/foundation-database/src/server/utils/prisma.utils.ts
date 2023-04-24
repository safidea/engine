import { StringUtils } from '@common/server'

class PrismaUtils {
  getModelName(name: string): string {
    return StringUtils.singular(StringUtils.capitalize(name))
  }
}

export default new PrismaUtils()
