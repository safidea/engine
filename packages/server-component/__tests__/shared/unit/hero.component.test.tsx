import { render, screen } from '@testing-library/react'
import { Components } from '@component'

const { Hero } = Components

describe('Hero', () => {
  it('should display Hero', () => {
    render(<Hero navigation={[{ name: 'Customers', href: '#' }]} />)
    expect(screen.getByText('Data to enrich your online business')).toBeVisible()
  })
})
