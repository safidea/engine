import { testNgrokIntegration } from '@test/integration/ngrok.shared'
import { NgrokBunIntegration } from './NgrokBunIntegration'
import { describe, it, expect } from 'bun:test'

const integration = new NgrokBunIntegration({
  authToken: 'test',
})

testNgrokIntegration({ describe, it, expect }, integration)
