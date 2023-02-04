import { deepCopy } from 'utils'
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

test('get component with Image Tag', async () => {
  const component = deepCopy(componentsMock[0])
  component.ui.tag = 'img'
  delete component.ui.children
  const script = getComponentScript(component)
  expect(script.search('Image') > -1).toBe(true)
  expect(/(?<=<Image)(.*)width(.*)(?=\/>)/g.test(script)).toBe(true)
  expect(/(?<=<Image)(.*)height(.*)(?=\/>)/g.test(script)).toBe(true)
})

test('get component with Link Tag', async () => {
  const component = deepCopy(componentsMock[0])
  component.ui.tag = 'a'
  const script = getComponentScript(component)
  expect(script.search('Link') > -1).toBe(true)
})
