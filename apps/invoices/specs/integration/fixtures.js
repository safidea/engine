import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import faker from '../faker'
import Foundation from '../../app/foundation'

const router = {
  push: jest.fn((/** @type {string} */ path) => path),
}

jest.mock('next/navigation', () => {
  return {
    useRouter: () => router,
  }
})

export { render, screen, userEvent, router, faker, Foundation }
