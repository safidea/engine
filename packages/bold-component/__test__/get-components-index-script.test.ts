import { componentsMock } from '../__mocks__/components.mock'
import getComponentIndexScript from '../src/get-components-index-script'

test('get component script', async () => {
  const script = getComponentIndexScript(componentsMock ?? [])
  for (const { name } of componentsMock ?? []) {
    expect(script.search(name) > -1).toBe(true)
  }
})
