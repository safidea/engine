// @ts-check
import { render, screen, userEvent, faker, Foundation, act, orm } from './fixtures'

describe('A page that update an invoice', () => {
  it('should display the invoice data from the home page', async () => {
    // GIVEN
    // An invoice is listed on the home page
    const invoice = await orm.invoice.create({
      data: faker.generate('invoices'),
    })
    await act(async () => {
      render(Foundation.page({ path: '/' }))
    })

    // WHEN
    // The user clicks on an invoice
    const editButton = screen.getByRole('link', { name: /Éditer/i })
    expect(editButton).toHaveAttribute('href', `/update/${invoice.id}`)
    await act(async () => {
      render(Foundation.page({ path: `/update/[id]`, pathParams: { id: invoice.id } }))
    })

    // THEN
    // The invoice data should be displayed
    /** @type {HTMLInputElement} */
    const companyField = screen.getByLabelText('Client')
    expect(companyField.value).toContain(invoice.customer)
    /** @type {HTMLInputElement} */
    const quantityField = screen.getByLabelText('Quantité')
    expect(quantityField.value).toContain(invoice.quantity.toString())
  })

  test.skip('should update an invoice in realtime without button', async () => {
    // GIVEN
    // An invoice is loaded in the update page
    const invoice = await orm.invoice.create({
      data: faker.generate('invoices'),
    })
    await act(async () => {
      render(Foundation.page({ path: `/update/[id]`, pathParams: { id: invoice.id } }))
    })

    // WHEN
    // We update the invoice data
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Client'), ' updated')

    // THEN
    // The invoice data should be updated in database
    const updatedInvoice = await orm.invoice.findUnique({ where: { id: invoice.id } })
    const newCustomerValue = invoice.customer + ' updated'
    expect(updatedInvoice.customer).toContain(newCustomerValue)
  })
})
