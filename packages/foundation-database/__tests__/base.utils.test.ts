import { ConfigService } from 'foundation-common'
import { base, prisma } from '../src'

import type { Config } from '../types'

test('should return a base', async () => {
  const { tables } = (await ConfigService.get()) as Config
  const table = Object.keys(tables)[0]
  expect(base(table)).toBeDefined()
})

test('should return prisma instance', () => {
  expect(prisma).toBeDefined()
})
