import { join } from 'path'
import fs from 'fs-extra'
import { PathUtils } from '@common/server'

import type { DatabasesInterface } from '@database'

class DatabaseUtils {
  public getDefaults(): DatabasesInterface {
    const path = join(PathUtils.getDataFolder() + '/database/master.db')
    fs.ensureFileSync(path)
    return {
      master: {
        url: 'file:' + path,
        provider: 'sqlite',
      },
    }
  }
}

export default new DatabaseUtils()
