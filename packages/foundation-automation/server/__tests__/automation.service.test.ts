import * as AutomationService from '../services/automation.service'

test('should be true', async () => {
  await AutomationService.run({})
  expect(true).toBe(true)
})
