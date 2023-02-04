import { deepCopy } from 'utils'
import { componentsMock } from '../__mocks__/components.mock'
import getComponentScript from '../src/get-component-script'

const types = componentsMock.map((c) => c.name)

test('get component script', async () => {
  for (const component of componentsMock ?? []) {
    const script = getComponentScript(component, types)
    for (const key of component.props ?? []) {
      expect(script.search(key) > -1).toBe(true)
    }
    for (const key of Object.keys(component.state ?? {})) {
      expect(script.search(key) > -1).toBe(true)
    }
  }
})

test(' get component with translation', async () => {
  const component = deepCopy(componentsMock[0])
  component.ui.children = ['{t("test")}']
  const script = getComponentScript(component, types)
  expect(/\{t\("test"\)\}/.test(script)).toBe(true)
  expect(/import \{ useTranslation \} from 'next-i18next'/.test(script)).toBe(true)
  expect(/const \{ t \} = useTranslation()/.test(script)).toBe(true)
})

test('get component with Image Tag', async () => {
  const component = deepCopy(componentsMock[0])
  component.ui.tag = 'img'
  delete component.ui.children
  const script = getComponentScript(component, types)
  expect(/(?<=<Image)(.*)width(.*)(?=\/>)/g.test(script)).toBe(true)
  expect(/(?<=<Image)(.*)height(.*)(?=\/>)/g.test(script)).toBe(true)
  expect(/import Image from 'next\/image'/.test(script)).toBe(true)
})

test('get component with Link Tag', async () => {
  const component = deepCopy(componentsMock[0])
  component.ui.tag = 'a'
  const script = getComponentScript(component, types)
  expect(/(?<=<Link)(.*)href(.*)(?=>)/g.test(script)).toBe(true)
  expect(/import Link from 'next\/link'/.test(script)).toBe(true)
})

test('get component with custom Component Tag', async () => {
  const component = deepCopy(componentsMock[0])
  component.ui.tag = 'Custom'
  const script = getComponentScript(component, ['Custom', ...types])
  expect(/(?<=<Custom)(.*)(?=>)/g.test(script)).toBe(true)
  expect(/import Custom from '.\/Custom'/.test(script)).toBe(true)
})

test('get component with custom Component loading', async () => {
  const component = deepCopy(componentsMock[0])
  component.ui.children = '{load("header")}'
  const script = getComponentScript(component, types)
  expect(/const load = \(/.test(script)).toBe(true)
  expect(/import Components from '.\/index'/.test(script)).toBe(true)
})
