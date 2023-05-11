import fs from 'fs-extra'
import DatabaseUtils from '@database/server/utils/database.utils'

jest.mock('fs-extra')

beforeAll(() => {
  jest.clearAllMocks()
})

describe('getDefaults', () => {
  it('should return defaults', () => {
    const result = DatabaseUtils.getDefaults()
    expect(result.master).toBeDefined()
    expect(result.master.url).toEqual(expect.any(String))
    expect(result.master.provider).toEqual(expect.any(String))
    expect(fs.ensureFileSync).toBeCalledTimes(1)
  })
})
