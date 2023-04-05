import { join } from 'path'
import { PathUtils } from '../'

const { DATA_FOLDER } = process.env
const ROOT_PATH = join(__dirname, '../../../..')

describe('get cache path', () => {
  it('should return the correct cache path for a file', () => {
    expect(PathUtils.cache('test')).toBe(join(ROOT_PATH, DATA_FOLDER as string, 'cache/test.json'))
  })

  it('should return the correct cache path for a folder', () => {
    expect(PathUtils.cache('test', { dir: true })).toBe(
      join(ROOT_PATH, DATA_FOLDER as string, 'cache/test')
    )
  })
})
