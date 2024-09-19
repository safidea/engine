import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'

test.describe('Logger', () => {
  test.describe('Console driver', () => {
    test('should log an info', async () => {
      // GIVEN
      const config: Config = {
        name: 'Theme',
        automations: [
          {
            name: 'logInfo',
            trigger: {
              event: 'ApiCalled',
})
