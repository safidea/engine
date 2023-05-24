import { user } from './setup'
import { render, screen } from '@testing-library/react'
import { Components } from '../../src'

let frame: ReturnType<typeof render>
const { hero: Hero } = Components
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
]

describe('Hero', () => {
  beforeEach(() => {
    frame = render(<Hero navigation={navigation} />)
  })

  it('renders the company logo', () => {
    const images = screen.getAllByRole('img')
    expect(images[0]).toHaveAttribute('src')
  })

  it('renders navigation links', () => {
    navigation.forEach((item) => {
      const link = screen.getByText(item.name)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', item.href)
    })
  })

  it('renders no navigation', () => {
    frame.rerender(<Hero />)
    navigation.forEach((item) => {
      expect(screen.queryByText(item.name)).not.toBeInTheDocument()
    })
  })

  it('opens the mobile menu when the button is clicked', async () => {
    await user.click(screen.getByRole('button', { name: /Open main menu/i }))
  })

  it('closes the mobile menu when the close button is clicked', async () => {
    await user.click(screen.getByRole('button', { name: /Open main menu/i }))
    await user.click(screen.getByRole('button', { name: /Close menu/i }))
  })

  it('renders the Log in link', () => {
    const link = screen.getByText('Log in')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#')
  })

  it('renders the Get started link', () => {
    const link = screen.getByText('Get started')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#')
  })

  it('renders the Learn more link', () => {
    const link = screen.getByText('Learn more')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#')
  })
})
