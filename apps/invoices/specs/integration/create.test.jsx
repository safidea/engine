import { render, screen, userEvent, router, faker, Foundation, act } from './fixtures'

// Can't import directly CreatePage from app/create/page because of metadata : https://github.com/vercel/next.js/issues/47299
const CreatePage = () => Foundation.page({ path: '/create' })
const HomePage = () => Foundation.page({ path: '/' })

describe('A page that create an invoice', () => {
  it('renders a heading', () => {
    // WHEN
    render(<CreatePage />)

    // THEN
    expect(screen.getByRole('heading', { name: /facture/i })).toBeInTheDocument()
  })

  it.skip('should create an invoice', async () => {
    // GIVEN
    render(<CreatePage />)
    const user = userEvent.setup()

    // WHEN
    // Fill the form
    const customerName = faker.company.name()
    await user.type(screen.getByLabelText('Client'), customerName)
    await user.type(screen.getByLabelText('Adresse'), faker.location.streetAddress())
    await user.type(screen.getByLabelText('Code postal'), faker.location.zipCode())
    await user.type(screen.getByLabelText('Pays'), faker.location.country())
    // Add a first line
    await user.click(screen.getByText('Nouvelle ligne'))
    let rows = screen.getAllByRole('row')
    let lastRow = rows[rows.length - 1]
    let utils = within(lastRow)
    await user.type(utils.getByPlaceholderText('Activité'), faker.commerce.productName())
    await user.type(utils.getByPlaceholderText('Unité'), faker.commerce.product())
    await user.type(utils.getByPlaceholderText('Quantité'), faker.number.int(20).toString())
    await user.type(
      utils.getByPlaceholderText('Prix unitaire'),
      faker.number.int({ max: 500 }).toString()
    )
    // Add a second line
    await user.click(screen.getByText('Nouvelle ligne'))
    rows = screen.getAllByRole('row')
    lastRow = rows[rows.length - 1]
    utils = within(lastRow)
    await user.type(utils.getByPlaceholderText('Activité'), faker.commerce.productName())
    await user.type(utils.getByPlaceholderText('Unité'), faker.commerce.product())
    await user.type(utils.getByPlaceholderText('Quantité'), faker.number.int(20).toString())
    await user.type(
      utils.getByPlaceholderText('Prix unitaire'),
      faker.number.int({ max: 500 }).toString()
    )
    // Submit the form
    await user.click(screen.getByText('Enregistrer'))
    await act(async () => {
      render(<HomePage />)
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
