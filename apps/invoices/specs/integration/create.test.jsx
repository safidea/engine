import { render, screen, userEvent, router, faker } from './fixtures'
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

  it('should fill a form and redirect to home page', async () => {
    // WHEN
    render(<CreatePage />)
    const user = userEvent.setup()

    // WHEN
    await user.type(screen.getByLabelText('Client'), faker.company.name())
    await user.type(screen.getByLabelText('Adresse'), faker.location.streetAddress())
    await user.type(screen.getByLabelText('Code postal'), faker.location.zipCode())
    await user.type(screen.getByLabelText('Pays'), faker.location.country())
    await user.type(screen.getByLabelText('Activité'), faker.commerce.productName())
    await user.type(screen.getByLabelText('Unité'), faker.commerce.product())
    await user.type(screen.getByLabelText('Quantité'), faker.number.int(20).toString())
    await user.type(
      screen.getByLabelText('Prix unitaire'),
      faker.number.int({ max: 500 }).toString()
    )
    await user.click(screen.getByText('Enregistrer'))

    // THEN
    expect(router.push).toHaveBeenCalledWith('/')
  })
})
