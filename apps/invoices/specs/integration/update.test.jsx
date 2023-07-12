// @ts-check
import {
  render,
  screen,
  userEvent,
  faker,
  Foundation,
  act,
  orm,
  waitForElementToBeRemoved,
  within,
} from './fixtures'

describe('A page that update an invoice', () => {
  it.skip('should display the invoice data from the home page', async () => {
    // GIVEN
    // An invoice is listed on the home page
    const data = faker.generate('invoices')
    const invoice = await orm.invoice.create({ data })
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
    for (let i = 0; i < data.items.length; i++) {
      const rows = screen.getAllByRole('row')
      const lastRow = rows[i]
      const utils = within(lastRow)
      /** @type {HTMLInputElement} */
      const field = utils.getByPlaceholderText('Activité')
      expect(field.value).toContain(data.items[i].activity)
    }
  })

  test('should update an invoice in realtime', async () => {
    // GIVEN
    // An invoice is loaded in the update page
    const invoice = await orm.invoice.create({
      data: faker.generate('invoices'),
    })
    await act(async () => {
      render(Foundation.page({ path: `/update/[id]`, pathParams: { id: invoice.id } }))
    })

    // WHEN
    // We update the invoice data and wait for autosave
    const updatedText = ' updated'
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Client'), updatedText)
    await waitForElementToBeRemoved(screen.getByText('Saving...'))

    // THEN
    // The invoice data should be updated in database
    const updatedInvoice = await orm.invoice.findUnique({ where: { id: invoice.id } })
    const newCustomerValue = invoice.customer + updatedText
    expect(updatedInvoice.customer).toContain(newCustomerValue)
  })
})
