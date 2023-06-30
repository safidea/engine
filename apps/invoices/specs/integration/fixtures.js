import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

const router = {
  push: (/** @type {string} */ path) => {
    console.warn(`Should redirect to page ${path}`)
  },
}

jest.mock('next/navigation', () => {
  return {
    useRouter: () => router,
  }
})

const user = userEvent.setup()

export { render, screen, user }
