import { componentsMock } from '../__mocks__/components.mock'
import getComponentScript from '../src/get-component-script'

test('get component script', async () => {
  for (const component of componentsMock ?? []) {
    const script = getComponentScript(component)
    for (const key of component.props ?? []) {
      expect(script.search(key) > -1).toBe(true)
    }
    for (const key of Object.keys(component.state ?? {})) {
      expect(script.search(key) > -1).toBe(true)
    }
  }
})
