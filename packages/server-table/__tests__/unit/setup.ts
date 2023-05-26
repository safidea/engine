export {}

process.env.FDT_APP_NAME = 'base'

jest.mock('fs-extra')
jest.mock('server-database/src/app')

beforeEach(() => {
  jest.clearAllMocks()
})
