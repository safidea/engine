import { join } from 'path'
import { ResourceService } from '../src'

test('should return imported modules', () => {
  const result = ResourceService.get(['module1', 'module2'])
  expect(result).toBe(
    `const module1 = require('${join(
      __dirname,
      '../generated/module1.js'
    )}')\nconst module2 = require('${join(__dirname, '../generated/module2.js')}')`
  )
})
