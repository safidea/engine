jest.mock('../../src/config', () => jest.requireActual('../../__mocks__/config'))
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { pages } from '../../src/config'
import Layout from '../../src/components/layout'

const { components } = pages[0]

beforeEach(async () => {
  await act(() => {
    render(<Layout components={components} />)
  })
})

test('should render components', () => {
  for (const { id } of components) {
    const element = document.getElementById(id)
    expect(element).toBeDefined()
  }
})
