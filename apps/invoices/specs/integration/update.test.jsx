import { render, screen, userEvent, faker, Foundation, act, orm } from './fixtures'

const HomePage = () => Foundation.page({ path: '/' })

describe('Invoice update page', () => {
  it('should display the invoice data', async () => {
    // GIVEN
    // An invoice is listed on the home page
    const companyValue = faker.company.name()
    const quantityValue = faker.number.int(20).toString()
    const unitPriceValue = faker.number.int({ max: 500 }).toString()
    const user = userEvent.setup()
    const row = await orm.invoice.create({
      data: {
        customer: companyValue,
        quantity: quantityValue,
        unit_price: unitPriceValue,
      },
    })
    await act(async () => {
      render(<HomePage />)
    })

    // WHEN
    // The user clicks on an invoice
    const editButton = screen.getByRole('button', { name: /modifier/i })
    await user.click(editButton)
    const UpdatePage = () => Foundation.page({ path: `/update/${row.id}` })
    await act(async () => {
      render(<UpdatePage />)
    })

    // THEN
    // The invoice data should be displayed
    const companyField = screen.getByLabelText('Client')
    const quantityField = screen.getByLabelText('Quantité')
    const unitPriceField = screen.getByLabelText('Prix unitaire')
    expect(companyField).toContain(companyValue)
    expect(quantityField).toContain(quantityValue)
    expect(unitPriceField).toContain(unitPriceValue)
  })
})
