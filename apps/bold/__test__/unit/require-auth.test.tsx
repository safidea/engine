// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: remove ts-nocheck

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { requireAuth } from '../../src/utils/'

beforeAll(() => {
  const Component = requireAuth(<div>Hello word</div>)
  render(<Component />)
})

test('should return the correct value', () => {
  expect(screen.queryByText(/Loading/i)).toBeInTheDocument()
})
