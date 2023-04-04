import fs from 'fs-extra'
import { PathUtils } from 'foundation-common'

import ResourceSetup from '../scripts/resource.setup'

test('should setup resources from config', async () => {
  await fs.remove(PathUtils.cache('resources', { dir: true }))
  const updates = await ResourceSetup()
  expect(updates).toHaveLength(1)
  expect(updates[0].isUpdated).toBe(true)
})

test('should setup resources from cache', async () => {
  const updates = await ResourceSetup()
  expect(updates).toHaveLength(1)
  expect(updates[0].isUpdated).toBe(false)
})

test('should able to use resource', async () => {
  const math = await import('../generated/math.js')
  expect(math.add(1, 2)).toBe(3)
})
