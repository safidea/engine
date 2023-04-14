import { ConfigService } from 'foundation-common/server'
import { PrismaService } from '../'

import type { Config } from '../../types'

test('should return a base', () => {
  const { tables } = ConfigService.get() as Config
  const table = Object.keys(tables)[0]
  expect(PrismaService.base(table)).toBeDefined()
})

test('should return prisma instance', () => {
  expect(PrismaService.getInstance()).toBeDefined()
})
