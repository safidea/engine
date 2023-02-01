import { pages } from 'bold-build'
import getPage from '../src/get-page'

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
