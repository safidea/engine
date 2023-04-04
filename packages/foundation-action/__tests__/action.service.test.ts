import fs from 'fs-extra'
import { PathUtils } from 'foundation-common'

import ActionSetup from '../scripts/action.setup'

test('should setup actions from config', async () => {
  await fs.remove(PathUtils.cache('actions', { dir: true }))
  const updates = await ActionSetup()
  expect(updates).toHaveLength(1)
  expect(updates[0].isUpdated).toBe(true)
})

test('should setup actions from cache', async () => {
  const updates = await ActionSetup()
  expect(updates).toHaveLength(1)
  expect(updates[0].isUpdated).toBe(false)
})

test('should able to use action', async () => {
  const add = (await import('../generated/add.js')).default as any
  const result = await add({ numbers: [1, 2] })
  expect(result).toBe(3)
})
