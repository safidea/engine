import fs from 'fs-extra'
import { join } from 'path'
import { PathUtils } from 'server-common'

import type { DatabasesInterface } from 'shared-database'

class DatabaseUtils {
  public getDefaults(): DatabasesInterface {
    const path = join(PathUtils.getAppDataFolder() + '/database/master.db')
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
