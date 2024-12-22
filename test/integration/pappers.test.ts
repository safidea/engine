import { test, expect } from '@test/fixtures'
import { integration } from '@test/integrations/pappers'

test.describe('Pappers integration', () => {
  test('should get a company from a siret', async () => {
    // GIVEN
    const siret = '44306184100047'

    // WHEN
    const company = await integration.getCompany(siret)

    // THEN
    expect(company?.denomination).toBe('GOOGLE FRANCE')
  })
})
