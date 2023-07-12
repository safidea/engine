// @ts-check
import { render, screen, userEvent, router, faker, Foundation, act, within, orm } from './fixtures'

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

  it('should create an invoice', async () => {
    // GIVEN
    const invoice = faker.generate('invoices')
    const user = userEvent.setup()
    render(<CreatePage />)

    // WHEN
    // Fill the form
    await user.type(screen.getByLabelText('Client'), invoice.customer)
    await user.type(screen.getByLabelText('Adresse'), invoice.address)
    await user.type(screen.getByLabelText('Code postal'), invoice.zip_code)
    await user.type(screen.getByLabelText('Pays'), invoice.country)
    // Add lines
    for (let i = 0; i < invoice.items.length; i++) {
      await user.click(screen.getByText('Nouvelle ligne'))
      const rows = screen.getAllByRole('row')
      const lastRow = rows[rows.length - 1]
      const utils = within(lastRow)
      await user.type(utils.getByPlaceholderText('Activité'), invoice.items[i].activity)
      await user.type(utils.getByPlaceholderText('Unité'), invoice.items[i].unity)
      await user.type(utils.getByPlaceholderText('Quantité'), invoice.items[i].quantity.toString())
      await user.type(
        utils.getByPlaceholderText('Prix unitaire'),
        invoice.items[i].unit_price.toString()
      )
    }
    // Submit the form
    await user.click(screen.getByText('Enregistrer'))
    await act(async () => {
      render(<HomePage />)
    })

    // THEN
    expect(router.push).toHaveBeenCalledWith('/')
    expect(screen.getByText(invoice.customer)).toBeInTheDocument()
    const items = await orm.invoices_item.findMany()
    expect(items).toHaveLength(invoice.items.length)
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
