import fs from 'fs-extra'
import { join } from 'path'
import { PathUtils } from '../src'

const { DATA_FOLDER, CONFIG_FILE } = process.env
const ROOT_PATH = join(__dirname, '../../..')
const DEFAULT_DATA_FOLDER_PATH = join(ROOT_PATH, 'data')

afterAll(() => {
  fs.removeSync(DEFAULT_DATA_FOLDER_PATH)
})

test('should return the correct config path', () => {
  expect(PathUtils.config()).toBe(join(ROOT_PATH, CONFIG_FILE as string))
})

test('should throw an error if the config path is not set', () => {
  delete process.env.CONFIG_FILE
  expect(PathUtils.config).toThrowError('CONFIG_FILE not set')
})

test('should return the correct PrismaSchema path', () => {
  expect(PathUtils.prismaSchema()).toBe(
    join(ROOT_PATH, DATA_FOLDER as string, 'prisma/schema.prisma')
  )
})

test('should return the correct PrismaClient path', () => {
  expect(PathUtils.prismaClient()).toBe(
    join(ROOT_PATH, 'packages/foundation-database/generated/prisma')
  )
})

test('should return the correct cache path', () => {
  expect(PathUtils.cache('test')).toBe(join(ROOT_PATH, DATA_FOLDER as string, 'cache/test.json'))
})

test('should return the correct PrismaSchema path with default data folder', () => {
  delete process.env.DATA_FOLDER
  expect(PathUtils.prismaSchema()).toBe(join(ROOT_PATH, 'data', 'prisma/schema.prisma'))
})

test('should return the correct cache path with default data folder', () => {
  delete process.env.DATA_FOLDER
  expect(PathUtils.cache('test')).toBe(join(ROOT_PATH, 'data', 'cache/test.json'))
})
