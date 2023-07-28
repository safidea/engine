import { ConfigureApp } from '@application/usecases/ConfigureApp'
import { describe, test, expect } from '@jest/globals'

describe('ConfigureApp', () => {
  test('should throw an error if validation failed', () => {
    // GIVEN
    const config = {
      unknown: 'unknown',
    }

    // WHEN
    const call = () => new ConfigureApp(config, {} as any).execute()

    // THEN
    expect(call).toThrowError('must NOT have additional properties')
  })
})
