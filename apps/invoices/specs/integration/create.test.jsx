// @ts-check
import { render, screen, user } from './fixtures'
import Foundation from './app/foundation'

// Can't import directly CreatePage from app/create/page because of metadata : https://github.com/vercel/next.js/issues/47299
const CreatePage = () => Foundation.page({ path: '/create' })

describe('Invoice creation page', () => {
  it('renders a heading', () => {
    // WHEN
    render(<CreatePage />)

    // THEN
    expect(screen.getByRole('heading', { name: /facture/i })).toBeInTheDocument()
  })

  it.skip('it compute the total amount', () => {
    // GIVEN
    render(<CreatePage />)

    // WHEN
    const quantity = 2
    const unit_price = 10
    user.type(screen.getByLabelText('Quantité'), quantity.toString())
    user.type(screen.getByLabelText('Prix unitaire'), unit_price.toString())

    // THEN
    const expectedTotal = quantity * unit_price
    expect(screen.getByLabelText('Total')).toEqual(expectedTotal)
  })
})
