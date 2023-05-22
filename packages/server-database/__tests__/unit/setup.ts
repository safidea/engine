process.env.FDT_APP_NAME = 'base'

jest.mock('fs-extra')
jest.mock('child_process')
jest.mock('../../src/apps')

import { AppUtils } from 'server-common'
import * as Apps from '../../src/apps'

AppUtils.register(Apps, 'server-database')

beforeEach(() => {
  jest.clearAllMocks()
})
