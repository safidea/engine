import { render, screen, userEvent, router, faker, Foundation, act, orm } from './fixtures'

// Can't import directly CreatePage from app/create/page because of metadata : https://github.com/vercel/next.js/issues/47299
const CreatePage = () => Foundation.page({ path: '/create' })
const HomePage = () => Foundation.page({ path: '/' })

describe('Invoice creation page', () => {
  it('renders a heading', () => {
    // WHEN
    render(<CreatePage />)

    // THEN
    expect(screen.getByRole('heading', { name: /facture/i })).toBeInTheDocument()
  })

  it('should create an invoice', async () => {
    // GIVEN
    const { rerender } = render(<CreatePage />)
    const user = userEvent.setup()

    // WHEN
    const customerName = faker.company.name()
    await user.type(screen.getByLabelText('Client'), customerName)
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
    await act(async () => {
      rerender(<HomePage />)
    })

    // THEN
    expect(router.push).toHaveBeenCalledWith('/')
    expect(screen.getByText(customerName)).toBeInTheDocument()
  })

  it('should display an error message when some required fields are not provided', async () => {
    // GIVEN
    render(<CreatePage />)
    const user = userEvent.setup()

    // WHEN
    await user.type(screen.getByLabelText('Client'), faker.company.name())
    await user.click(screen.getByText('Enregistrer'))

    // THEN
    expect(screen.getByText(/Field address is required/i)).toBeInTheDocument()
  })
})
