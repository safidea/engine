jest.mock('../../src/config', () => jest.requireActual('../../__mocks__/config'))

import { pages } from '../../src/config'
import getPage from '../../src/utils/get-page'

test('should get page', () => {
  const path = pages[0].path
  const page = getPage(path)
  expect(page).toEqual(pages.find((t) => t.path === path))
})

test('should get an error', () => {
  const wrongPath = '../test'
  try {
    getPage(wrongPath)
    expect(false).toBeTruthy()
  } catch (e) {
    if (e instanceof Error) {
      expect(e.message).toEqual(`Their is no page for path ${wrongPath}`)
    } else {
      expect(false).toBeTruthy()
    }
  }
})
