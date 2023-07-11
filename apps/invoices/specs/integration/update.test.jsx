// @ts-check
import { render, screen, faker, Foundation, act, orm } from './fixtures'

describe('A page that update an invoice', () => {
  it('should display the invoice data from the home page', async () => {
    // GIVEN
    // An invoice is listed on the home page
    const companyValue = faker.company.name()
    const quantityValue = faker.number.int(20).toString()
    const unitPriceValue = faker.number.int({ max: 500 }).toString()
    const row = await orm.invoice.create({
      data: {
        customer: companyValue,
        quantity: quantityValue,
        unit_price: unitPriceValue,
      },
    })
    await act(async () => {
      render(Foundation.page({ path: '/' }))
    })

    // WHEN
    // The user clicks on an invoice
    const editButton = screen.getByRole('link', { name: /Éditer/i })
    expect(editButton).toHaveAttribute('href', `/update/${row.id}`)
    await act(async () => {
      render(Foundation.page({ path: `/update/[id]`, pathParams: { id: row.id } }))
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
