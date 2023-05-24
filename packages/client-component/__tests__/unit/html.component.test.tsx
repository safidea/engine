import './setup'
import { render, screen } from '@testing-library/react'

import { Html } from '../../src'

describe('Html', () => {
  it('renders the html', () => {
    render(<Html tag="h1">Hello World</Html>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders the html with a wrong tag', () => {
    render(<Html tag="h7">Hello World</Html>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders the html with no children', () => {
    const props = { alt: 'image' }
    render(<Html tag="img" {...props} />)
    expect(screen.getByAltText('image')).toBeInTheDocument()
  })
})
