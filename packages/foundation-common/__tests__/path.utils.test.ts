import { join } from 'path'
import { PathUtils } from '../src'

const { DATA_FOLDER } = process.env
const ROOT_PATH = join(__dirname, '../../..')

test('should return the correct PrismaSchema path', () => {
  expect(PathUtils.prismaSchema()).toBe(
    join(ROOT_PATH, DATA_FOLDER as string, 'prisma/schema.prisma')
  )
})

test('should return the correct PrismaClient path', () => {
  expect(PathUtils.prismaClient()).toBe(
    join(ROOT_PATH, 'packages/foundation-database/prisma/client')
  )
})

test('should return the correct cache path', () => {
  expect(PathUtils.cache('test')).toBe(join(ROOT_PATH, DATA_FOLDER as string, 'cache/test.json'))
})
