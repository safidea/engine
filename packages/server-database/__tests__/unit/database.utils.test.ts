import './setup'
import fs from 'fs-extra'
import DatabaseUtils from '../../src/utils/database.utils'

describe('getDefaults', () => {
  it('should return defaults', () => {
    const result = DatabaseUtils.getDefaults()
    expect(result.master).toBeDefined()
    expect(result.master.url).toEqual(expect.any(String))
    expect(result.master.provider).toEqual(expect.any(String))
    expect(fs.ensureFileSync).toBeCalledTimes(1)
  })
})
