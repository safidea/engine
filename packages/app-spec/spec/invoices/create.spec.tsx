import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/app/spec.app'
import getInvoicesConfig from '../../src/configs/invoices.config'
//import { BrowserRouter } from 'react-router-dom'

describe('A page that allow to create an invoice', () => {
  it('should display a page title', async () => {
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

  // TODO: Fix this test with the navigation
  it.skip('should allow the create of an invoice', async () => {
    // GIVEN
    // A Configuration .json that describe an invoice management app
    const config = getInvoicesConfig()

    // Configuration of the test app
    const app = new App({ config })
    await app.start()
    const user = userEvent.setup()

    // WHEN
    // I go to the create page
    render(app.page('/create'))

    await user.type(screen.getByLabelText(/Address/i), 'ESSENTIEL, 128 RUE LA BOÉTIE, 75008 PARIS')
    await user.click(screen.getByRole('button', { name: /Save/i }))

    // THEN
    // Check that I'm on the / page (home)
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    await act(async () => {
      render(app.page('/'))
    })
    expect(screen.getByRole('heading', { name: /All invoices/i })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(1)

    await app.stop()
  })
})
