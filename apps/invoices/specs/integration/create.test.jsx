// @ts-check
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Foundation from '../../app/foundation'
import { Components } from 'foundation'

const router = {
  push: (/** @type {string} */ path) => {
    console.warn(`Should redirect to page ${path}`)
  },
}

function Form(props) {
  return <Components.Form {...props} router={router} />
}

function Navigation(props) {
  return <Components.Navigation {...props} router={router} />
}

describe('Invoice creation page', () => {
  it('renders a heading', () => {
    // GIVEN

    // WHEN
    render(Foundation.page({ path: '/create', components: { Form, Navigation } }))

    // THEN
    expect(screen.getByRole('heading', { name: /facture/i })).toBeInTheDocument()
  })

  it.skip('it compute the total amount', () => {
    // GIVEN
    render(Foundation.page({ path: '/create' }))
    const user = userEvent.setup()

    // WHEN
    const quantity = 2
    const unit_price = 10
    user.type(screen.getByLabelText('Quantité'), quantity.toString())
    user.type(screen.getByLabelText('Prix unitaire'), unit_price.toString())

    // THEN
    const expectedTotal = quantity * unit_price
    expect(screen.getByLabelText('Total')).toEqual(expectedTotal)
  })
})
