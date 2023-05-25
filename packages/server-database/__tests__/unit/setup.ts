process.env.FDT_APP_NAME = 'base'

jest.mock('fs-extra')
jest.mock('child_process')
jest.mock('../../src/app')

import { AppUtils } from 'server-common'
import * as App from '../../src/app'

AppUtils.registerLibraries(App, 'server-database')

beforeEach(() => {
  jest.clearAllMocks()
})
