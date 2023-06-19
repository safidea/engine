import { render, screen, act } from '@testing-library/react'
import App from '../../src/app/spec.app'
import getInvoicesConfig from '../../src/configs/invoices.config'

describe('A page that allow to create an invoice', () => {
  it('should create a new invoice', async () => {
    // GIVEN
    // A Configuration .json that describe an invoice management app
    const config = getInvoicesConfig()

    // Configuration of the test app
    const app = new App({ config })
    await app.start()

    // WHEN
    // I go to the create page
    await act(async () => {
      render(app.page('/create'))
    })

    // THEN
    // Check that I'm on the /create page
    expect(screen.getByRole('heading', { name: /Create an invoice/i })).toBeInTheDocument()

    await app.stop()
  })
})
