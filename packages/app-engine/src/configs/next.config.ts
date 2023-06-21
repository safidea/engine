import dotenv from 'dotenv'
import { join } from 'path'
import { getAppPath } from '../utils/server.utils'

dotenv.config({ path: join(getAppPath(), '.env') })

import NextAppServer from '../providers/server/next.server.provider'

NextAppServer.execConfig()
