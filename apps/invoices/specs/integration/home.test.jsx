// @ts-check
import { render, screen, Page, act, faker, orm } from './fixtures'

describe('Invoice creation page', () => {
  it('renders a heading', async () => {
    // WHEN
    await act(async () => {
      render(<Page path="/" />)
    })

    // THEN
    expect(screen.getByRole('heading', { name: /facture/i })).toBeInTheDocument()
  })

  it('should open the update invoice page', async () => {
    // GIVEN
    // An invoice is listed on the home page
    const data = faker.generate('invoices')
    const itemsIds = []
    for (const item of data.items) {
      const row = await orm.invoices_item.create({ data: item })
      itemsIds.push(row.id)
    }
    data.items = itemsIds
    const invoice = await orm.invoice.create({ data })
    for (const itemId of itemsIds) {
      await orm.invoices_item.update({
        where: { id: itemId },
        data: { invoice: invoice.id },
      })
    }

    // WHEN
    // We open the home page with an invoice
    await act(async () => {
      render(<Page path="/" />)
    })

    // THEN
    // The edit button should be displayed
    const editButton = screen.getByRole('link', { name: /Éditer/i })
    expect(editButton).toHaveAttribute('href', `/update/${invoice.id}`)
  })
})
