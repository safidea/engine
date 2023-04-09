import { ConfigService } from 'foundation-common/server'

import type { Resources } from '../../types'
import { ResourceService } from '../'

test('should return imported modules', () => {
  const resources = ConfigService.get('resources') as Resources
  const result = ResourceService.getRequirementsCode(Object.keys(resources))
  expect(result).toBeDefined()
})
