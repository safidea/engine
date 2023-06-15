import dotenv from 'dotenv'
import { join } from 'path'
import { getAppPath } from './shared'
dotenv.config({ path: join(getAppPath(), '.env') })

import NextAppServer from './server'

NextAppServer.execConfig()
