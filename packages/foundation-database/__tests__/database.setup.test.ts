import { DatabaseSetup } from '../src'

test('should setup the database', async () => {
  try {
    await DatabaseSetup()
  } catch (error) {
    expect(error).toBeUndefined()
  }
})
