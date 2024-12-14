import type { QontoCreateClient } from '@domain/integrations/Qonto'
import { test, expect } from '@tests/fixtures'
import { integration } from '@tests/integrations/qonto'

test.describe('Qonto integration', () => {
  test('should create a client', async () => {
    // GIVEN
    const createClient: QontoCreateClient = {
      name: 'John Doe',
      type: 'company',
      email: 'test@test.com',
      vat_number: 'FR12345678901',
      currency: 'EUR',
      locale: 'FR',
      address: '1 rue de Paris',
      city: 'Paris',
      zip_code: '75001',
      country_code: 'FR',
    }

    // WHEN
    const client = await integration.createClient(createClient)

    // THEN
    expect(client?.id).toBeDefined()
  })
})
