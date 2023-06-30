import { render, screen } from './fixtures'
import Foundation from './app/foundation'

// Can't import directly CreatePage from app/create/page because of metadata : https://github.com/vercel/next.js/issues/47299
const HomePage = () => Foundation.page({ path: '/' })

describe('Invoice creation page', () => {
  it('renders a heading', () => {
    // WHEN
    render(<HomePage />)

    // THEN
    expect(screen.getByRole('heading', { name: /facture/i })).toBeInTheDocument()
  })
})
