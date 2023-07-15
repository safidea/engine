// @ts-check
import {
  render,
  screen,
  userEvent,
  faker,
  Page,
  act,
  orm,
  waitForElementToBeRemoved,
  waitFor,
  within,
} from './fixtures'

describe('A page that update an invoice', () => {
  it('should display the invoice data from the home page', async () => {
    // GIVEN
    // An invoice is listed on the home page
    const data = faker.generate('invoices')
    const items = data.items
    data.items = { create: items }
    const invoice = await orm.invoice.create({ data })

    // WHEN
    // We open the update page with an invoice
    await act(async () => {
      render(<Page path="/update/[id]" pathParams={{ id: invoice.id }} />)
    })

    // THEN
    // The invoice data should be displayed
    /** @type {HTMLInputElement} */
    const companyField = screen.getByLabelText('Client')
    expect(companyField.value).toContain(invoice.customer)
    const rows = screen.getAllByRole('row')
    for (let i = 0; i < items.length; i++) {
      const row = rows[i + 1]
      const utils = within(row)
      /** @type {HTMLInputElement} */
      const field = utils.getByPlaceholderText('Activité')
      expect(field.value).toContain(items[i].activity)
    }
  })

  it('should update client invoice information in realtime', async () => {
    // GIVEN
    // An invoice is loaded in the update page
    const data = faker.generate('invoices')
    data.items = { create: data.items }
    const invoice = await orm.invoice.create({ data })
    await act(async () => {
      render(<Page path="/update/[id]" pathParams={{ id: invoice.id }} />)
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

  // TODO: make sure that this test can run as expected even while others are running
  it('should update invoice items in realtime', async () => {
    // GIVEN
    // There is an invoice with 1 item
    const data = faker.generate('invoices')
    const item = { ...data.items[0], activity: 'activity' }
    data.items = { create: [item] }
    const invoice = await orm.invoice.create({ data })
    await act(async () => {
      render(<Page path="/update/[id]" pathParams={{ id: invoice.id }} />)
    })

    // WHEN
    // We update the activity of the first invoice item line
    const updatedActivity = 'activity B'
    await userEvent.type(screen.getByPlaceholderText('Activité'), ' B')
    await waitForElementToBeRemoved(screen.getByText('Saving...'))

    // THEN
    // activity was updated
    const [firstInvoiceItem] = await orm.invoices_item.findMany()
    expect(firstInvoiceItem.activity).toBe(updatedActivity)
  })
})
