import testComponentsUI from '../src/test-components-ui'
import { componentsMock } from '../__mocks__/components.mock'

test('component should be valid', async () => {
  const errors = await testComponentsUI(componentsMock)
  expect(errors).toHaveLength(0)
})

test('component should have invalid props', async () => {
  const componentsBroken = JSON.parse(JSON.stringify(componentsMock))
  for (const component of componentsBroken) {
    component.props = component?.props?.slice(1)
  }
  const errors = await testComponentsUI(componentsBroken)
  expect(errors).toHaveLength(componentsBroken.length)
})

test('component should have invalid state', async () => {
  const componentsBroken = JSON.parse(JSON.stringify(componentsMock))
  for (const component of componentsBroken) {
    const keys = Object.keys(component?.state ?? {})
    delete component.state[keys[0]]
  }
  const errors = await testComponentsUI(componentsBroken)
  expect(errors).toHaveLength(componentsBroken.length)
})
