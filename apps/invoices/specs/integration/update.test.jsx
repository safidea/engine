// @ts-check
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
    const editButton = screen.getByRole('link', { name: /Éditer/i })
    await user.click(editButton)
    const UpdatePage = () => Foundation.page({ path: `/update/[id]`, pathParams: { id: row.id } })
    await act(async () => {
      render(<UpdatePage />)
    })

    // THEN
    // The invoice data should be displayed
    /** @type {HTMLInputElement} */
    const companyField = screen.getByLabelText('Client')
    /** @type {HTMLInputElement} */
    const quantityField = screen.getByLabelText('Quantité')
    /** @type {HTMLInputElement} */
    const unitPriceField = screen.getByLabelText('Prix unitaire')
    expect(companyField.value).toContain(companyValue)
    expect(quantityField.value).toContain(quantityValue)
    expect(unitPriceField.value).toContain(unitPriceValue)
  })
})
