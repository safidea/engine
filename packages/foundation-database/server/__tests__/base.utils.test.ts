import { ConfigService } from 'foundation-common/server'
import { base, prisma } from '../'

import type { Config } from '../../types'

test('should return a base', () => {
  const { tables } = ConfigService.get() as Config
  const table = Object.keys(tables)[0]
  expect(base(table)).toBeDefined()
})

test('should return prisma instance', () => {
  expect(prisma).toBeDefined()
})
