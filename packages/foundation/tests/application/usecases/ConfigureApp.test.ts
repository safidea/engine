import { ConfigureApp } from '@application/usecases/ConfigureApp'
import { describe, test, expect } from '@jest/globals'

describe('ConfigureApp', () => {
  test.skip('should throw an error if schema is not as the same format as expected', async () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const call = () => new ConfigureApp(config, null as any).execute()

    // THEN
    expect(call).toThrow('Config validation fail : "unknown" property is not allowed')
  })
})
